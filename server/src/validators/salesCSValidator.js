const csv = require("csv-parser");
const salesSchema = require("./salesJoiSchema");

//This function reads a CSV file and validates each row against the salesSchema.
const validateSales = async (readableStream, options) => {
  const badRows = [];
  const goodRows = [];
  let rowNumber = 0;
  for await (const row of readableStream.pipe(csv())) {
    rowNumber++;
    try {
      const validatedData = await salesSchema.validateAsync(row, options);
      goodRows.push({ rowNumber: rowNumber, data: validatedData });
    } catch (err) {
      badRows.push({
        rowNumber: rowNumber,
        error: err.details[0].message,
      });
    }
  }

  return {
    goodRows,
    badRows,
  };
};

module.exports = validateSales;
