const mainClient = require("../../prisma/main/client");

const deleteNotification = async (req, res) => {
  const businessId = req.user?.businessId;
  const notificationId = parseInt(req.params.id);

  if (!businessId) {
    return res.status(400).send({ error: "Invalid request" });
  }

  if (isNaN(notificationId)) {
    return res.status(400).send({ error: "Invalid notification ID" });
  }

  try {
    const deletedNotification = await mainClient.notification.delete({
      where: {
        id: notificationId,
        businessId: businessId,
      },
    });

    return res.status(200).send({ data: deletedNotification });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        winston.warn("Delete attempt for non-existent notification:", {
          notificationId,
          businessId,
        });
        return res.status(404).send({ error: "Notification not found" });
      }

      winston.error("Database error during deletion:", {
        code: error.code,
        meta: error.meta,
        message: error.message,
      });
      return res.status(500).send({ error: "Database operation failed" });
    }

    winston.error("Unexpected deletion error:", {
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).send({ error: "Internal server error" });
  }
};
module.exports = { deleteNotification };
