const prisma = require("../../prisma/main/client");

async function populateMainCategories() {
  try {
    // Define an expanded set of meaningful categories without image
    const categories = [
      {
        name: "Electronics",
        description:
          "Devices and gadgets including phones, laptops, and accessories",
        hasExpiryDate: false,
      },
      {
        name: "Groceries",
        description: "Food items and household essentials",
        hasExpiryDate: true,
      },
      {
        name: "Clothing",
        description: "Apparel for all ages and styles",
        hasExpiryDate: false,
      },
      {
        name: "Pharmacy",
        description: "Medicines and health-related products",
        hasExpiryDate: true,
      },
      {
        name: "Furniture",
        description: "Home and office furniture items",
        hasExpiryDate: false,
      },
      {
        name: "Books",
        description: "Fiction, non-fiction, and educational books",
        hasExpiryDate: false,
      },
      {
        name: "Toys",
        description: "Toys and games for children",
        hasExpiryDate: false,
      },
      {
        name: "Automotive",
        description: "Car parts, accessories, and maintenance products",
        hasExpiryDate: false,
      },
      {
        name: "Cosmetics",
        description: "Beauty and personal care products",
        hasExpiryDate: true,
      },
      {
        name: "Sports Equipment",
        description: "Gear and accessories for sports and fitness",
        hasExpiryDate: false,
      },
      {
        name: "Beverages",
        description: "Alcoholic and non-alcoholic drinks",
        hasExpiryDate: true,
      },
      {
        name: "Stationery",
        description: "Office supplies and writing materials",
        hasExpiryDate: false,
      },
      {
        name: "Pet Supplies",
        description: "Products for pets including food and accessories",
        hasExpiryDate: true,
      },
      {
        name: "Hardware",
        description: "Tools and construction materials",
        hasExpiryDate: false,
      },
      {
        name: "Jewelry",
        description: "Accessories like rings, necklaces, and watches",
        hasExpiryDate: false,
      },
      {
        name: "Appliances",
        description: "Household appliances like refrigerators and microwaves",
        hasExpiryDate: false,
      },
      {
        name: "Gardening",
        description: "Plants, seeds, and gardening tools",
        hasExpiryDate: true,
      },
      {
        name: "Footwear",
        description: "Shoes, sandals, and boots for all purposes",
        hasExpiryDate: false,
      },
      {
        name: "Cleaning Supplies",
        description: "Detergents, disinfectants, and cleaning tools",
        hasExpiryDate: true,
      },
      {
        name: "Baby Products",
        description: "Items for infants including diapers and formula",
        hasExpiryDate: true,
      },
      {
        name: "Musical Instruments",
        description: "Instruments like guitars, pianos, and drums",
        hasExpiryDate: false,
      },
      {
        name: "Outdoor Gear",
        description: "Camping, hiking, and outdoor recreation equipment",
        hasExpiryDate: false,
      },
      {
        name: "Bakery",
        description: "Freshly baked goods like bread, cakes, and pastries",
        hasExpiryDate: true,
      },
      {
        name: "Home Decor",
        description: "Decorative items for homes like vases and curtains",
        hasExpiryDate: false,
      },
      {
        name: "Personal Electronics",
        description: "Small electronic devices like headphones and chargers",
        hasExpiryDate: false,
      },
    ];

    // Insert categories into the main database
    const result = await prisma.category.createMany({
      data: categories,
      skipDuplicates: true, // Avoid duplicates based on 'name' uniqueness
    });

    console.log(
      `Successfully populated ${result.count} categories into the main database`
    );
    return result;
  } catch (error) {
    console.error("Error populating main database categories:", error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function populate() {
  await populateMainCategories();
}

// Run if executed directly
if (require.main === module) {
  populate().catch((e) => {
    console.error("Population script failed:", e);
    process.exit(1);
  });
}

module.exports = populateMainCategories;
