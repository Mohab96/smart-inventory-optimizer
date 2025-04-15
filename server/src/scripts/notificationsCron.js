const cron = require("node-cron");
const winston = require("winston");
const { getLowStockPrediction } = require("../utils/LowStockPrediction");
const { getProductPredection } = require("../utils/ProductPrediction");
const { expiringSoon } = require("../utils/expiringSoon");
const mainClient = require("../../prisma/main/client");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "cron_notifications.log" }),
  ],
});

const tasks = [
  {
    fn: getLowStockPrediction,
    title: "Low Stock Prediction",
    params: { days: 7, topProducts: 5 },
  },
  {
    fn: getProductPredection,
    title: "Products Demand Prediction",
    params: { days: 7, topProducts: 5 },
  },
  { fn: expiringSoon, title: "Products Expiring Soon", params: {} },
];

async function runNotificationsCron(businessId) {
  if (!businessId) {
    throw new Error("businessId is required");
  }

  const runDate = new Date();
  logger.info(`Running cron for businessId: ${businessId} at ${runDate}`);

  for (const { fn, title, params } of tasks) {
    try {
      logger.info(`Running ${title} for businessId: ${businessId}`);
      const result = await fn({ businessId, ...params });
      const parsedResult = JSON.parse(result);

      await mainClient.notification.create({
        data: {
          date: runDate,
          description: { data: parsedResult },
          title,
          businessId,
        },
      });
      logger.info(
        `Stored notification for ${title} for businessId: ${businessId}`
      );
    } catch (error) {
      logger.error(
        `Failed to process ${title} for businessId: ${businessId}: ${error.message}`,
        {
          stack: error.stack,
        }
      );
    }
  }
}

async function main() {
  try {
    // Fetch all business IDs from the Business table
    const businesses = await mainClient.business.findMany({
      select: { id: true },
    });

    if (businesses.length === 0) {
      logger.warn("No businesses found in the database");
      return;
    }

    logger.info(`Found ${businesses.length} businesses`);

    // Run the cron job for each business
    for (const { id } of businesses) {
      await runNotificationsCron(id);
    }

    logger.info("Cron job completed for all businesses");
  } catch (error) {
    logger.error("Cron job failed", {
      error: error.message,
      stack: error.stack,
    });
  } finally {
    await mainClient.$disconnect();
  }
}

// Schedule the cron job to run daily at midnight
cron.schedule("0 0 * * *", async () => {
  logger.info("Starting scheduled cron job...");
  await main();
});
