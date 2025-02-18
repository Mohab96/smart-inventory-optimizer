const csv = require("csv-parser");
const winston = require("winston");
const purchasesSchema = require("./purchasesJoiSchema");

//This function reads a CSV file and validates each row against the purchasesSchema.
const validatePurchases = async (readableStream, options) => {
  const badRows = [];
  const goodRows = [];
  let rowNumber = 0;
  for await (const row of readableStream.pipe(csv())) {
    rowNumber++;
    try {
      const validatedData = await purchasesSchema.validateAsync(row, options);
      goodRows.push({ rowNumber: rowNumber, data: validatedData });
    } catch (err) {
      badRows.push({
        rowNumber: rowNumber,
        error: err.details[0].message,
      });
      winston.debug(err);
    }
  }

  return {
    goodRows,
    badRows,
  };
};

module.exports = validatePurchases;
