const amqp = require("amqplib");
const winston = require("winston");
let connection = null;

const getConnection = async () => {
  try {
    connection = connection || (await amqp.connect(process.env.RABBITMQ_URL));
    winston.info("Connected to RabbitMQ successfully...");
    return connection;
  } catch (ex) {
    winston.error("couldn't connect to RabbitMQ", ex);
    process.exit(31);
  }
};

const createChannel = async () => {
  return await connection.createChannel();
};

module.exports = { getConnection, createChannel };
