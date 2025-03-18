const csv = require("csv-parser");
const winston = require("winston");
const purchasesSchema = require("./purchasesJoiSchema");
const maindb = require("../../prisma/main/client");
const productsIds = new Map();
const rows = [];
const badRows = [];

//This function reads a CSV file and validates each row against the purchasesSchema.
const validatePurchases = async (readableStream, options) => {
  const goodRows = [];
  let rowNumber = 0;

  for await (const row of readableStream.pipe(csv())) {
    rowNumber++;
    rows.push({ rowNumber, ...row });
  }
  await preProcess(options.businessId);
  rowNumber = 0;
  for (const row of rows) {
    rowNumber++;
    try {
      const validatedData = purchasesSchema.validate(row, options);
      validatedData.value.productId = productsIds.get(
        validatedData.value.productName
      );
      goodRows.push({ rowNumber, data: { ...validatedData.value } });
    } catch (err) {
      badRows.push({
        rowNumber: rowNumber,
        error: err.details[0].message,
      });
      console.debug(err);
    }
  }
  console.log("Finished validating rows");

  await isPresent(options.businessId);
  console.log("Finished checking if products are present");

  // await checkUniqueness(options.businessId);
  console.log("Finished checking uniqueness, returning results");

  console.log("First Good Row: ", goodRows[0]);

  return {
    goodRows,
    badRows,
  };
};

const isPresent = async (businessId) => {
  const formattedData = rows.map((row) => ({
    name: row.productName,
    rowNumber: row.rowNumber,
    productId: productsIds.get(row.productName),
  }));

  for (const row of formattedData) {
    if (row.productId === undefined) {
      badRows.push({
        rowNumber: row.rowNumber,
        error: `Product ${row.name} not found`,
      });
    }
  }
};

const checkUniqueness = async (businessId) => {
  // Map rows to keys with productId, batchId, and rowNumber.
  const keys = rows.map((row) => ({
    productId: productsIds.get(row.productName),
    batchId: +row.batchId, // converting to number if needed
    rowNumber: row.rowNumber,
  }));

  let existingBatches = [];
  // Adjust batch size to avoid too many bind variables.
  const BATCH_SIZE = Math.floor(32767 / 2); // 16383 keys max per batch

  // Process keys in chunks.
  for (let i = 0; i < keys.length; i += BATCH_SIZE) {
    const chunk = keys.slice(i, i + BATCH_SIZE);

    const chunkExistingBatches = await maindb.batch.findMany({
      where: {
        OR: chunk.map((key) => ({
          productId: key.productId,
          id: key.batchId,
        })),
      },
      select: {
        productId: true,
        id: true,
      },
    });

    existingBatches = existingBatches.concat(chunkExistingBatches);
  }

  if (existingBatches.length === 0) return;

  // Identify rows with non-unique key pairs.
  const notUniqueRowNumbers = keys
    .filter((key) =>
      existingBatches.some(
        (batch) => batch.productId === key.productId && batch.id === key.batchId
      )
    )
    .map((key) => ({
      rowNumber: key.rowNumber,
      error: `Batch ${key.batchId} and Product ${key.productId} combination already exists`,
    }));

  // Append errors to badRows array.
  badRows.push(...notUniqueRowNumbers);
};
const preProcess = async (businessId) => {
  const uniqueProducts = [...new Set(rows.map((row) => row.productName))];

  const ret = await maindb.product.findMany({
    where: {
      businessId: businessId,
      name: {
        in: uniqueProducts,
      },
    },
    select: {
      id: true,
      name: true,
    },
  });
  for (const product of ret) {
    productsIds.set(product.name, product.id);
  }
};
module.exports = validatePurchases;
