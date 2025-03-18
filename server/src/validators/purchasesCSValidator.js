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
  await preProcess(readableStream, options.businessId);

  for (const row of rows) {
    try {
      const validatedData = purchasesSchema.validate(row, options);

      if (productsIds.get(row.productName) === undefined)
        throw new Error(
          `Product ${row.productName} in row ${row.rowNumber} not found`
        );

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
        error: err.details[0].message || err.message,
      });
      console.debug(err);
    }
  }
  console.log("Finished validating rows");

  await checkUniqueness(options.businessId);
  console.log("Finished checking uniqueness, returning results");

  return {
    goodRows,
    badRows,
  };
};

const checkUniqueness = async (businessId) => {
  const batchIds = rows.map((row) => row.batchId);
  const records = maindb.batch.findMany({
    where: {
      id: {
        in: batchIds,
      },
    },
    select: {
      id: true,
      productId: true,
    },
  });
  const recordsMap = new Map();
  records.map((record) => {
    recordsMap.set(record.id, record.productId);
  });
  for (const row of rows) {
    const productId = productsIds.get(row.productName);
    if (recordsMap.get(row.batchId) === productId) {
      badRows.push({
        rowNumber: row.rowNumber,
        error: `Batch ${row.batchId} and Product ${productId} combination already exists on row ${row.rowNumber}`,
      });
    }
  }
};

const preProcess = async (readableStream, businessId) => {
  let rowNumber = 0;
  for await (const row of readableStream.pipe(csv())) {
    rowNumber++;
    rows.push({ rowNumber, ...row });
  }

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
