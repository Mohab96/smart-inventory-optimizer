const mainClient = require("../../prisma/main/client");

const getTodayNotifications = async (req, res) => {
  const businessId = req.user?.businessId;
  if (!businessId) {
    return res.status(400).send({ error: "Invalid request" });
  }
  try {
    const notifications = await mainClient.notification.findMany({
      where: {
        businessId: businessId,
      },
      orderBy: {
        date: "desc",
      },
    });

    if (!Array.isArray(notifications)) {
      throw new Error("Unexpected response format from database");
    }
    const requiredTitles = [
      "Products Expiring Soon",
      "Products Demand Prediction",
      "Low Stock Prediction",
    ];

    const notificationsMap = new Map();
    notifications.forEach((notif) => {
      notificationsMap.set(notif.title, {
        title: notif.title,
        date: notif.date.toISOString(),
        data: notif.description.data,
      });
    });

    const result = requiredTitles.map((title) => {
      return (
        notificationsMap.get(title) || {
          title,
          date: null,
          data: [],
        }
      );
    });

    return res.status(200).send({ data: result });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      winston.error("Database error:", {
        code: error.code,
        meta: error.meta,
        message: error.message,
      });
      return res.status(500).send({ error: "Database operation failed" });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      winston.warn("Validation error:", error.message);
      return res.status(400).send({ error: error.message });
    }

    // Handle custom errors
    if (error.status) {
      winston.error(`Business error (${error.status}):`, error.message);
      return res.status(error.status).send({ error: error.message });
    }

    // Handle unexpected errors
    winston.error("Unexpected error:", {
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).send({ error: "Internal server error" });
  }
};

module.exports = { getTodayNotifications };
