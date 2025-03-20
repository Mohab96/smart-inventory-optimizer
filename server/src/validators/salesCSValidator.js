const csv = require("csv-parser");
const salesSchema = require("./salesJoiSchema");
const maindb = require("../../prisma/main/client");
const toUTCDate = require("../utils/toUTCDate");
const rows = [];
const badRows = [];
const goodRows = [];

const productsIds = new Map();
//This function reads a CSV file and validates each row against the salesSchema.
const validateSales = async (readableStream, options) => {
  await preProcess(readableStream, options.businessId);

  for (const row of rows) {
    try {
      const validatedData = salesSchema.validate(row, options);
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
  if (badRows.length === 0) await asyncValidate(options.businessId);
  return {
    goodRows,
    badRows,
  };
};

module.exports = validateSales;

const asyncValidate = async (businessId) => {
  const productIds = rows.map((row) => productsIds.get(row.productName));
  const batchIds = rows.map((row) => row.batchId);
  const batches = await maindb.$queryRaw`
  SELECT *
  FROM "Batch"
  WHERE ("productId", "id") IN (
    SELECT * FROM UNNEST(${productIds}::int[], ${batchIds}::int[]) AS t(productId, batchId)
  )
`;
  const recordsMap = new Map();
  for (const record of batches) {
    const compositeKey = `${record.id}-${record.productId}`;
    recordsMap.set(compositeKey, record);
  }
  let cnt = -1;
  for (const row of rows) {
    cnt++;
    const productId = productsIds.get(row.productName);
    const compositeKey = `${row.batchId}-${productId}`;
    if (!recordsMap.has(compositeKey)) {
      badRows.push({
        rowNumber: row.rowNumber,
        error: `Batch ${row.batchId} and Product ${productId} combination does not exists.`,
      });
    } else
      goodRows[cnt].data.generatedId = recordsMap.get(compositeKey).generatedId;
    if (row.date < recordsMap.get(compositeKey).receiptDate) {
      badRows.push({
        rowNumber: row.rowNumber,
        error: `Sale date must be after the receipt date.`,
      });
    }
    if (row.amount > recordsMap.get(compositeKey).remQuantity) {
      badRows.push({
        rowNumber: row.rowNumber,
        error: `Sale amount exceeds batch remaining quantity.`,
      });
    }
  }
};

const preProcess = async (readableStream, businessId) => {
  let rowNumber = 0;
  for await (const row of readableStream.pipe(csv())) {
    rowNumber++;
    try {
      row.date = toUTCDate(row.date);
      row.batchId = parseInt(row.batchId);
      row.amount = parseInt(row.amount);
      row.discount = parseFloat(row.discount);
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
