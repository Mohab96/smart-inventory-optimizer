const { createChannel } = require("./rabbitMQ");
const readCSV = require("../../utils/CSVParser");
const validateSales = require("../../validators/salesCSValidator");
const insertSalesTransaction = require("../maindb/insertSalesTransaction");
const { updateCsvStatus } = require("../maindb/csvStatus");
const winston = require("winston");
///TODO: investigate why the channel closes on its own
const salesConsumer = async () => {
  let channel;
  try {
    channel = await createChannel();
    const queue = "sales";
    await channel.assertQueue(queue, { durable: true });
    winston.info("Sales consumer started successfully...");
    await channel.consume(
      queue,
      async (msg) => {
        if (msg !== null) {
          let message;
          try {
            ///parse the message
            message = JSON.parse(msg.content.toString());
            await updateCsvStatus(message.id, "Processing");
            ///parse the CSV file
            const stream = await readCSV(message.bucketName, message.fileName);
            ///validate the CSV file
            const data = await validateSales(stream, {
              context: { businessId: message.businessId },
            });
            //check final state and push to database
            if (data.badRows.length > 0) {
              await updateCsvStatus(message.id, "Failed", data.badRows);
            } else {
              await insertSalesTransaction(data, message);
              await updateCsvStatus(message.id, "Done");
            }
            channel.ack(msg);
          } catch (error) {
            winston.error("Error processing sales message:", error);
            await updateCsvStatus(message.id, "Failed", {
              error: "Error processing sales message:",
            });
            channel.nack(msg, false, false);
          }
        }
      },
      {
        noAck: false,
      }
    );
  } catch (error) {
    winston.error("Error in sales consumer:", error);
  }
};

module.exports = salesConsumer;
