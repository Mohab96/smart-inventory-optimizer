const dwh = require("../../prisma/dwh/client");
const main = require("../../prisma/main/client");
async function populateBusinessDimension() {
  try {
    // Fetch all records from the business table
    const businessRecords = await main.business.findMany();

    // Insert records into the businessDimension table
    const businessDimensionData = businessRecords.map((record) => ({
      businessId: record.id,
      businessName: record.name,
    }));

    await dwh.businessDimension.createMany({
      data: businessDimensionData,
      skipDuplicates: true, // Optional: skips duplicates if any
    });

    console.log("Data successfully populated into businessDimension table.");
  } catch (error) {
    console.error("Error populating businessDimension table:", error);
  }
}

module.exports = populateBusinessDimension;
