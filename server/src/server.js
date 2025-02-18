const express = require("express");
const winston = require("winston");
const app = express();

async function run() {
  await require("./startup/logging")();
  await require("./startup/config")();
  await require("./startup/db")();
  await require("./startup/routes")(app);
  await require("./services/rabbitMQ/rabbitMQ").getConnection();
  await require("./services/rabbitMQ/purchasesConsumer")();
  await require("./services/rabbitMQ/salesConsumer")();
  const port = process.env.PORT || 3000;
  app.listen(port, () => winston.info(`Listening on port ${port}...`));
}

run();
