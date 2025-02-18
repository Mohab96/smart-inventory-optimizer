const express = require("express");
const path = require("path");
const cors = require("cors");
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = YAML.load(path.join(__dirname, "../../swagger.yaml"));
const endpoints = require("../utils/endpoints");
const error = require("../middlewares/error");
const staff = require("../routes/staff");
const auth = require("../routes/auth");
const statisticsRouter = require("../routes/statistics");
const acknowledgementRouter = require("../routes/acknowledgement");
const storageRouter = require("../routes/storage");
const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
module.exports = function (app) {
  app.use(
    cors({
      exposedHeaders: ["Authorization"],
    })
  );
  app.use(express.json());
  app.use(
    endpoints.API_DOCS,
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      customCss:
        ".swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }",
      customCssUrl: CSS_URL,
    })
  ); // for swagger documentation

  app.use(endpoints.STAFF, staff);
  app.use(endpoints.AUTH, auth);
  app.use(endpoints.STATISTICS, statisticsRouter);
  app.use(endpoints.STORAGE, storageRouter);
  app.use(endpoints.ACKNOWLEDGEMENT, acknowledgementRouter);
  app.use(error); //make sure this is the last route always
};
