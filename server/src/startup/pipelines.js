const Pipeline = require("../services/etl/pipeline");
const PipelineService = require("../services/etl/pipelineService");

const productRevenueFactExtractor = require("../services/etl/extractors/productRevenueFactExtractor");
const productRevenueFactLoader = require("../services/etl/loaders/productRevenueFactLoader");
const productRevenueTransformer = require("../services/etl/transformers/productRevenueFactTransformer");

const productDimensionExtractor = require("../services/etl/extractors/productDimensionExtractor");
const productDimensionLoader = require("../services/etl/loaders/productDimensionLoader");
const productDimensionTransformer = require("../services/etl/transformers/productDimensionTransformer");

const batchInfoTransformer = require("../services/etl/transformers/batchInfoTransformer");
const batchInfoLoader = require("../services/etl/loaders/batchInfoLoader");
const batchInfoExtractor = require("../services/etl/extractors/batchInfoExtractor");

const transactionFactExtractor = require("../services/etl/extractors/transactionFactExtractor");
const transactionFactLoader = require("../services/etl/loaders/transactionFactLoader");
const transactionFactTransformer = require("../services/etl/transformers/transactionFactTransformer");

const inventoryFactExtractor = require("../services/etl/extractors/inventoryFactExtractor");
const inventoryFactLoader = require("../services/etl/loaders/inventoryFactLoader");
const inventoryFactTransformer = require("../services/etl/transformers/inventoryFactTransformer");

const categoryRevenueFactExtractor = require("../services/etl/extractors/categoryRevenueFactExtractor");
const categoryRevenueFactLoader = require("../services/etl/loaders/categoryRevenueFactLoader");
const categoryRevenueTransformer = require("../services/etl/transformers/categoryRevenueFactTransformer");

const productRevenuePipeline = new Pipeline(
  productRevenueFactExtractor,
  productRevenueTransformer,
  productRevenueFactLoader,
  "0 0 * * *",
  "Product Revenue Pipeline"
);

const productDimensionPipeline = new Pipeline(
  productDimensionExtractor,
  productDimensionTransformer,
  productDimensionLoader,
  "0 0 * * *",
  "Product Dimension Pipeline"
);

const batchInfoPipeline = new Pipeline(
  batchInfoExtractor,
  batchInfoTransformer,
  batchInfoLoader,
  "0 0 * * *",
  "Batch Info Pipeline"
);

const transactionFactPipeline = new Pipeline(
  transactionFactExtractor,
  transactionFactTransformer,
  transactionFactLoader,
  "0 0 * * *",
  "Transaction Fact Pipeline"
);

const inventoryFactPipeline = new Pipeline(
  inventoryFactExtractor,
  inventoryFactTransformer,
  inventoryFactLoader,
  "0 0 * * *",
  "Inventory Fact Pipeline"
);

const categoryRevenuePipeline = new Pipeline(
  categoryRevenueFactExtractor,
  categoryRevenueTransformer,
  categoryRevenueFactLoader,
  "0 0 * * *",
  "Category Revenue Pipeline"
);

const pipelinesList = [
  productDimensionPipeline,
  batchInfoPipeline,
  transactionFactPipeline,
  inventoryFactPipeline,
  productRevenuePipeline,
  categoryRevenuePipeline,
];

const pipelines = new PipelineService(pipelinesList);

async function start() {
  await pipelines.start();
}

// start();
