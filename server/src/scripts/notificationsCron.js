const cron = require("cron");
const winston = require("winston");
const { getLowStockPrediction } = require("../utils/LowStockPrediction");
const { getProductPredection } = require("../utils/ProductPrediction");
const { expiringSoon } = require("../utils/expiringSoon");
const mainClient = require("../../prisma/main/client");

// Configure logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "cron_notifications.log" }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

// Global error handlers
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", { promise, reason });
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

// Task configuration
const tasks = [
  {
    fn: getLowStockPrediction,
    title: "Low Stock Prediction",
    params: { days: 7, topProducts: 5 },
    timeout: 300000,
  },
  {
    fn: getProductPredection,
    title: "Products Demand Prediction",
    params: { days: 7, topProducts: 5 },
    timeout: 300000,
  },
  {
    fn: expiringSoon,
    title: "Products Expiring Soon",
    params: {},
    timeout: 300000,
  },
];

// Timeout wrapper function
const runWithTimeout = (fn, timeout) =>
  Promise.race([
    fn(),
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`Task timed out after ${timeout}ms`)),
        timeout
      )
    ),
  ]);

async function runNotificationsCron(businessId) {
  if (!businessId) {
    throw new Error("businessId is required");
  }

  const runDate = new Date();
  logger.info(`Starting cron for business: ${businessId}`);

  for (const { fn, title, params, timeout } of tasks) {
    try {
      logger.info(`Processing ${title} for ${businessId}`);

      const result = await runWithTimeout(
        () => fn({ businessId, ...params }),
        timeout
      );

      const parsedResult =
        typeof result === "string" ? safeJsonParse(result) : result;

      await mainClient.notification.create({
        data: {
          date: runDate,
          description: { data: parsedResult },
          title,
          businessId,
        },
      });

      logger.info(`Completed ${title} for ${businessId}`);
    } catch (error) {
      logger.error(`${title} failed for ${businessId}: ${error.message}`, {
        errorDetails: error.stack,
      });
    }
  }
}

// Safe JSON parsing
function safeJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return { error: "Invalid JSON response", raw: str?.slice(0, 200) };
  }
}

// Memory monitoring
function logMemoryUsage() {
  const used = process.memoryUsage();
  logger.info("Memory Usage:", {
    rss: `${Math.round(used.rss / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)}MB`,
  });
}
async function main() {
  let client;
  try {
    client = await mainClient.$connect();

    const businesses = await mainClient.business.findMany({
      where: {
        Product: {
          some: {}, // Only businesses with at least one product
        },
      },
      select: {
        id: true,
        _count: {
          select: { Product: true },
        },
      },
    });
    if (!businesses?.length) {
      logger.warn("No businesses with products found");
      return;
    }

    logger.info(`Processing ${businesses.length} businesses with products`);

    for (const { id, _count } of businesses) {
      if (_count.Product < 1) {
        logger.warn(`Skipping business ${id} with no products`);
        continue;
      }

      await runNotificationsCron(id);
    }

    logger.info("Completed processing for businesses with products");
  } catch (error) {
    logger.error("Main processing failed", {
      error: error.message,
      stack: error.stack,
    });
  } finally {
    if (client) await client.$disconnect();
    logMemoryUsage();
  }
}

let isJobRunning = false;

const job = new cron.CronJob(
  "*/1 * * * *",
  async () => {
    if (isJobRunning) {
      logger.warn("Previous job still running - skipping execution");
      return;
    }

    try {
      isJobRunning = true;
      logger.info("==== Starting cron job ====");
      await main();
      logger.info("==== Completed cron job ====");
    } catch (error) {
      logger.error("Cron job fatal error:", error);
    } finally {
      isJobRunning = false;
    }
  },
  null,
  true,
  "UTC"
);

process.on("SIGINT", async () => {
  logger.info("Shutting down cron job...");
  job.stop();
  await mainClient.$disconnect();
  process.exit();
});

logger.info("Cron job scheduler initialized");
