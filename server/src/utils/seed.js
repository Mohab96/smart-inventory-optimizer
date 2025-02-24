const { faker } = require("@faker-js/faker");
const dwhClient = require("../../prisma/dwh/client");
const populateDateDimension = require("./populateDateDimension");

async function seedDatabase(
  startYear,
  endYear,
  businessCount,
  productsCount,
  categoriesCount,
  productRevenueCount,
  categoryRevenueCount,
  batchCount,
  inventoryCount,
  transactionsCount
) {
  // 0. Clear all data
  console.log("Clearing all data...");

  await dwhClient.productRevenueFact.deleteMany();
  await dwhClient.categoryRevenueFact.deleteMany();
  await dwhClient.batchInfo.deleteMany();
  await dwhClient.inventoryFact.deleteMany();
  await dwhClient.transactionFact.deleteMany();
  await dwhClient.productDimension.deleteMany();
  await dwhClient.categoryDimension.deleteMany();
  await dwhClient.businessDimension.deleteMany();
  await dwhClient.dateDimension.deleteMany();

  console.log("All data cleared.");

  // 1. DateDimension
  let dates = await populateDateDimension(startYear, endYear);

  console.log(`${dates.length} dates created.`);

  dates = await dwhClient.dateDimension.findMany();

  const dateIDs = dates.map((date) => date.dateId);

  // 2. BusinessDimension
  let businesses = [];
  for (let i = 0; i < businessCount; i++) {
    businesses.push({ businessName: faker.company.name() });
  }

  businesses = await dwhClient.businessDimension.createMany({
    data: businesses,
  });

  console.log(`${businesses.count} businesses created.`);

  businesses = await dwhClient.businessDimension.findMany();

  // 3. CategoryDimension
  let categories = [];

  for (let i = 0; i < categoriesCount; i++) {
    categories.push({
      categoryName: faker.commerce.department(),
      hasExpiryDate: false,
    });
  }

  categories = await dwhClient.categoryDimension.createMany({
    data: categories,
  });

  console.log(`${categories.count} categories created.`);

  categories = await dwhClient.categoryDimension.findMany();

  // 4. ProductDimension
  let products = [];
  const categoryIDs = categories.map((category) => category.categoryId);
  const businessIDs = businesses.map((business) => business.businessId);

  for (let i = 0; i < productsCount; i++) {
    products.push({
      name: faker.commerce.productName(),
      categoryId: faker.helpers.arrayElement(categoryIDs),
      businessId: faker.helpers.arrayElement(businessIDs),
    });
  }

  products = await dwhClient.productDimension.createMany({ data: products });

  console.log(`${products.count} products created.`);

  products = await dwhClient.productDimension.findMany();

  // 5. ProductRevenueFact
  let productRevenues = [];
  const productIDs = products.map((product) => product.productId);

  for (let i = 0; i < productRevenueCount; i++) {
    productRevenues.push({
      productId: faker.helpers.arrayElement(productIDs),
      businessId: faker.helpers.arrayElement(businessIDs),
      dateId: faker.helpers.arrayElement(dateIDs),
      revenueAmount: faker.number.int({ min: 100, max: 1000 }),
      totalUnitsSold: faker.number.int({ min: 10, max: 100 }),
    });
  }

  productRevenues = await dwhClient.productRevenueFact.createMany({
    data: productRevenues,
  });

  console.log(`${productRevenues.count} product revenues created.`);

  productRevenues = await dwhClient.productRevenueFact.findMany();

  // 6. CategoryRevenueFact
  let categoryRevenues = [];

  for (let i = 0; i < categoryRevenueCount; i++) {
    categoryRevenues.push({
      businessId: faker.helpers.arrayElement(businessIDs),
      categoryId: faker.helpers.arrayElement(categoryIDs),
      dateId: faker.helpers.arrayElement(dateIDs),
      revenueAmount: faker.number.int({ min: 1000, max: 10000 }),
      totalUnitsSold: faker.number.int({ min: 100, max: 1000 }),
    });
  }

  categoryRevenues = await dwhClient.categoryRevenueFact.createMany({
    data: categoryRevenues,
  });

  console.log(`${categoryRevenues.count} category revenues created.`);

  categoryRevenues = await dwhClient.categoryRevenueFact.findMany();

  // 7. BatchInfo
  let batches = [];

  for (let i = 0; i < batchCount; i++) {
    batches.push({
      productId: faker.helpers.arrayElement(productIDs),
      dateId: faker.helpers.arrayElement(dateIDs),
      businessId: faker.helpers.arrayElement(businessIDs),
      quantity: faker.number.int({ min: 10, max: 100 }),
      purchasePrice: faker.number.int({ min: 10, max: 100 }),
      sellingPrice: faker.number.int({ min: 10, max: 100 }),
      expiryDate: faker.date.future(),
    });
  }

  batches = await dwhClient.batchInfo.createMany({ data: batches });

  console.log(`${batches.count} batches created.`);

  batches = await dwhClient.batchInfo.findMany();

  // 8. InventoryFact
  let inventoryLevels = [];

  for (let i = 0; i < inventoryCount; i++) {
    inventoryLevels.push({
      productId: faker.helpers.arrayElement(productIDs),
      businessId: faker.helpers.arrayElement(businessIDs),
      dateId: faker.helpers.arrayElement(dateIDs),
      currentStock: faker.number.int({ min: 10, max: 100 }),
    });
  }

  inventoryLevels = await dwhClient.inventoryFact.createMany({
    data: inventoryLevels,
  });

  console.log(`${inventoryLevels.count} inventory records created.`);

  // 9. TransactionFact
  let transactions = [];

  for (let i = 0; i < transactionsCount; i++) {
    transactions.push({
      productId: faker.helpers.arrayElement(productIDs),
      businessId: faker.helpers.arrayElement(businessIDs),
      dateId: faker.helpers.arrayElement(dateIDs),
      amount: faker.number.int({ min: 10, max: 100 }),
      discount: faker.number.int({ min: 0, max: 10 }),
    });
  }

  transactions = await dwhClient.transactionFact.createMany({
    data: transactions,
  });

  console.log(`${transactions.count} transactions created.`);
}

seedDatabase(2000, 2100, 100, 500, 50, 5000, 1500, 10000, 10000, 50000);
