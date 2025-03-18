const csv = require("csv-parser");
const salesSchema = require("./salesJoiSchema");
const maindb = require("../../prisma/main/client");
const rows = [];
const badRows = [];
const goodRows = [];

const productsIds = new Map();
//This function reads a CSV file and validates each row against the salesSchema.
const validateSales = async (readableStream, options) => {
  await preProcess(readableStream, options.businessId);
  console.log("finished preProcess");
  console.log("Validating rows...");

  for (const row of rows) {
    try {
      const validatedData = salesSchema.validate(row, options);
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
    }
  }
  console.log("Finished validating rows");
  console.log("Validating batches...");
  await asyncValidate(options.businessId);
  console.log("Finished validating batches and returning results");
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
    recordsMap.set(compositeKey, record.generatedId);
  }
  let cnt = 0;
  for (const row of rows) {
    const productId = productsIds.get(row.productName);
    const compositeKey = `${row.batchId}-${productId}`;
    if (!recordsMap.has(compositeKey)) {
      badRows.push({
        rowNumber: row.rowNumber,
        error: `Batch ${row.batchId} and Product ${productId} combination does not exists. on row ${row.rowNumber}`,
      });
    } else goodRows[cnt].data.generatedId = recordsMap.get(compositeKey);
    cnt++;
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
