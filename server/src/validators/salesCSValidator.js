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
  for (const row of rows) {
    try {
      const validatedData = await salesSchema.validate(row, options);
      if (productsIds.get(row.productName) === undefined)
        throw new Error(
          `Product ${row.productName} in row ${row.rowNumber} not found`
        );

      ///the row is valid
      ///TODO: change how you insert to goodRows
      validatedData.value.productId = productsIds.get(
        validatedData.value.productName
      );
      goodRows.push({
        rowNumber: row.rowNumber,
        data: { ...validatedData.value },
      });
      goodRows.push({ rowNumber: row.rowNumber, data: validatedData });
    } catch (err) {
      badRows.push({
        rowNumber: row.rowNumber,
        error: err.details[0].message,
      });
    }
  }
  await asyncValidate(options.businessId);
  return {
    goodRows,
    badRows,
  };
};

module.exports = validateSales;

const asyncValidate = async (businessId) => {
  // Find the product that has this name and is associated with a batch that has the given batchId
  const batchs = await client.batch.findFirst({
    where: {
      productId: productID,
      id: batchId,
    },
  });
  if (!batchs)
    return helpers.error("any.invalid", { message: "Batch not found." });

  if (amount > batchs.remQuantity)
    return helpers.error("any.invalid", {
      message: "Sale amount exceeds batch remaining quantity.",
    });

  if (value.date < batchs.receiptDate)
    return helpers.error("any.invalid", {
      message: "Sale date must be after the receipt date.",
    });

  return { ...value, productId: productID, batchInfo: batchs };
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
