const mainPrisma = require("../../prisma/main/client");
const dwhPrisma = require("../../prisma/dwh/client");

async function populateCategoryDimension() {
  try {
    // Fetch all categories from the main database
    const categories = await mainPrisma.category.findMany({
      select: {
        id: true,
        name: true,
        hasExpiryDate: true,
      },
    });

    if (categories.length === 0) {
      console.log("No categories found in the main database to populate.");
      return { count: 0 };
    }

    // Transform data to match CategoryDimension schema
    const records = categories.map((category) => ({
      categoryId: category.id,
      categoryName: category.name,
      hasExpiryDate: category.hasExpiryDate,
    }));

    // Insert all records into CategoryDimension in bulk
    const result = await dwhPrisma.categoryDimension.createMany({
      data: records,
      skipDuplicates: true, // Prevent duplicate entries based on categoryId
    });

    console.log(
      `Successfully populated ${result.count} categories into CategoryDimension`
    );
    return result;
  } catch (error) {
    console.error("Error populating CategoryDimension:", error.message);
    throw error; // Re-throw for caller to handle if needed
  }
}

module.exports = populateCategoryDimension;
