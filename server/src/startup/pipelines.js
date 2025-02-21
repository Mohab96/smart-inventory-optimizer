const Pipeline = require("../services/etl/pipeline");
const PipelineService = require("../services/etl/pipelineService");

const productRevenueFactExtractor = require("../services/etl/extractors/productRevenueFactExtractor");
const productRevenueFactLoader = require("../services/etl/loaders/productRevenueFactLoader");
const productRevenueTransformer = require("../services/etl/transformers/productRevenueFactTransformer");

const productRevenuePipeline = new Pipeline(
  productRevenueFactExtractor,
  productRevenueTransformer,
  productRevenueFactLoader,
  "0 0 * * *",
  "Product Revenue Pipeline"
);

const pipelinesList = [productRevenuePipeline];
const pipelines = new PipelineService(pipelinesList);

async function start() {
  await pipelines.start();
}

start();
