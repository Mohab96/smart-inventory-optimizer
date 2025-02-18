const winston = require("winston");
const { createChannel } = require("./rabbitMQ");
const client = require("../../../prisma/main/client");
const { createCsvStatus } = require("../maindb/csvStatus");
const sendMessage = async (queue, message) => {
  let channel;
  try {
    channel = await createChannel();

    const data = await createCsvStatus({
      businessId: message.businessId,
      uploadedDate: message.uploadedDate,
      status: "In queue",
      path: message.fileName,
    });

    message.id = data.id;
    await channel.assertQueue(queue, { durable: true });
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

    if (process.env.NODE_ENV === "development") {
      winston.debug(`Sent message to ${queue}: ${message}`);
    }
  } catch (error) {
    /// delete the record from the database if the message could not be sent
    if (message.id) {
      await client.cSVStatus.delete({
        where: {
          id: message.id,
        },
      });
    }
    return error;
  } finally {
    if (channel) await channel.close();
  }
};

module.exports = sendMessage;
