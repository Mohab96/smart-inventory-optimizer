const csv = require("csv-parser");
const winston = require("winston");
const purchasesSchema = require("./purchasesJoiSchema");
const maindb = require("../../prisma/main/client");
const toUTCDate = require("../utils/toUTCDate");
const productsIds = new Map();
const rows = [];
const badRows = [];

//This function reads a CSV file and validates each row against the purchasesSchema.
const validatePurchases = async (readableStream, options) => {
  const goodRows = [];
  await preProcess(readableStream, options.businessId);

  for (const row of rows) {
    try {
      const validatedData = purchasesSchema.validate(row, options);
      if (validatedData.error) throw validatedData.error;

      if (productsIds.get(row.productName) === undefined)
        throw new Error(`Product ${row.productName} not found`);

      ///the row is valid
      validatedData.value.productId = productsIds.get(
        validatedData.value.productName
      );
      goodRows.push({
        rowNumber: row.rowNumber,
        data: { ...validatedData.value },
      });
    } catch (err) {
      badRows.push({
        rowNumber: row.rowNumber,
        error: err?.details?.[0]?.message || err?.message,
      });
    }
  }
  if (badRows.length === 0) await checkUniqueness(options.businessId);

  return {
    goodRows,
    badRows,
  };
};

const checkUniqueness = async (businessId) => {
  const batchIds = rows.map((row) => +row.batchId);
  const chunkSize = 10000;
  let records = [];
  for (let i = 0; i < batchIds.length; i += chunkSize) {
    const chunk = batchIds.slice(i, i + chunkSize);
    const chunkRecords = await maindb.batch.findMany({
      where: {
        id: { in: chunk },
      },
      select: {
        id: true,
        productId: true,
      },
    });
    records.push(...chunkRecords);
  }

  const recordsMap = new Map();
  for (const record of records) {
    const compositeKey = `${record.id}-${record.productId}`;
    recordsMap.set(compositeKey, true);
  }

  for (const row of rows) {
    const productId = productsIds.get(row.productName);
    const compositeKey = `${row.batchId}-${productId}`;
    if (recordsMap.has(compositeKey)) {
      badRows.push({
        rowNumber: row.rowNumber,
        error: `Batch ${row.batchId} and Product ${productId} combination already exists`,
      });
    }
  }
};

const preProcess = async (readableStream, businessId) => {
  let rowNumber = 0;
  for await (const row of readableStream.pipe(csv())) {
    rowNumber++;
    try {
      row.expiryDate = toUTCDate(row.expiryDate);
      row.dateOfReceipt = toUTCDate(row.dateOfReceipt);
      rows.push({ rowNumber, ...row });
    } catch {
      badRows.push({
        rowNumber: rowNumber,
        error: `Invalid data format`,
      });
    }
  }
  if (badRows.length > 0) return;
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
