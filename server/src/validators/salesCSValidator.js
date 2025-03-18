const csv = require("csv-parser");
const salesSchema = require("./salesJoiSchema");
const maindb = require("../../prisma/main/client");
rows = [];
const productsIds = new Map();
//This function reads a CSV file and validates each row against the salesSchema.
const validateSales = async (readableStream, options) => {
  const badRows = [];
  const goodRows = [];
  await preProcess(readableStream, options.businessId);
  console.log("finished preProcess");
  for (const row of rows) {
    console.log("processing row: ", row.rowNumber);
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
  console.log("first good row: ", goodRows[0]);
  await asyncValidate(options.businessId);
  process.exit(0);
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
  console.log("batches: ", batches, "size: ", batches.length);
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
