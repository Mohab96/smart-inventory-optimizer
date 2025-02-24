const prisma = require("../../prisma/dwh/client");

async function populateDateDimension(startYear, endYear) {
  try {
    // Validate input
    if (startYear > endYear) {
      throw new Error("Start year must be less than or equal to end year.");
    }

    // Generate all dates between startYear and endYear
    const records = [];
    let currentDate = new Date(startYear, 0, 1); // January 1st of startYear
    const endDate = new Date(endYear + 1, 0, 1); // January 1st of the year after endYear

    while (currentDate < endDate) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // Months are 0-indexed in JavaScript
      const day = currentDate.getDate();
      const week = getWeekNumber(currentDate); // Custom helper function to calculate week number
      const quarter = Math.ceil(month / 3); // Calculate quarter (1-4)

      records.push({
        fullDate: currentDate.toISOString(), // Store as ISO string
        day: day,
        week: week,
        month: month,
        quarter: quarter,
        year: year,
      });

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Insert all records in bulk
    const dates = await prisma.dateDimension.createMany({
      data: records,
      skipDuplicates: true, // Prevent duplicate entries if the table already has some data
    });

    return dates;
  } catch (error) {
    console.error("Error populating DateDimension:", error.message);
  } finally {
    await prisma.$disconnect(); // Disconnect from the database
  }
}

function getWeekNumber(date) {
  const target = new Date(date.getTime());
  const dayNr = (date.getDay() + 6) % 7; // ISO week starts on Monday
  target.setDate(target.getDate() - dayNr + 3); // Adjust to Thursday of the same week
  const firstThursday = new Date(target.getFullYear(), 0, 1);
  firstThursday.setDate(1 + ((4 - firstThursday.getDay() + 7) % 7)); // First Thursday of the year
  const diff = (target - firstThursday) / (24 * 60 * 60 * 1000); // Difference in milliseconds
  return 1 + Math.ceil(diff / 7);
}

async function populate() {
  const startYear = +process.argv[2];
  const endYear = +process.argv[3];

  await populateDateDimension(startYear, endYear);
}

module.exports = populateDateDimension;
