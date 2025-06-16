const prisma = require("../../prisma/dwh/client");
const toUTCDate = require("../utils/toUTCDate");
function moveDayForwardUTC(date) {
  const newDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
  return newDate;
}
async function populateDateDimension(startYear, endYear) {
  try {
    // Validate input
    if (startYear > endYear) {
      throw new Error("Start year must be less than or equal to end year.");
    }

    // Generate all dates between startYear and endYear
    const records = [];
    let currentDate = toUTCDate(`1/1/${startYear}`); // January 1st of startYear
    let endDate = toUTCDate(`1/0/${endYear + 1}`); // January 1st of the year after endYear
    // console.log(currentDate, endDate);
    while (currentDate <= endDate) {
      const year = currentDate.getUTCFullYear();
      const month = currentDate.getUTCMonth() + 1; // Months are 0-indexed in JavaScript
      const day = currentDate.getUTCDate();
      const week = getWeekNumber(currentDate); // Custom helper function to calculate week number
      const quarter = Math.ceil(month / 3); // Calculate quarter (1-4)

      records.push({
        fullDate: currentDate,
        day: day,
        week: week,
        month: month,
        quarter: quarter,
        year: year,
      });
      // Move to the next day
      currentDate = moveDayForwardUTC(currentDate);
    }

    // console.log(records);
    // Insert all records in bulk
    const dates = await prisma.dateDimension.createMany({
      data: records,
      skipDuplicates: true, // Prevent duplicate entries if the table already has some data
    });

    return dates;
  } catch (error) {
    console.error("Error populating DateDimension:", error.message);
  }
}

function getWeekNumber(date) {
  // Ensure input is treated as UTC by cloning with UTC methods
  const target = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );

  // Get day of week (0=Sunday, 6=Saturday), adjust to ISO (Monday=0)
  const dayNr = (date.getUTCDay() + 6) % 7;

  // Move to Thursday of the same week (Thursday is the ISO week pivot)
  target.setUTCDate(target.getUTCDate() - dayNr + 3);

  // Get the first Thursday of the year
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const firstDay = firstThursday.getUTCDay();
  const daysToFirstThursday = (4 - firstDay + 7) % 7; // 4 is Thursday
  firstThursday.setUTCDate(1 + daysToFirstThursday);

  // Calculate weeks (milliseconds to days, then to weeks)
  const diffMs = target - firstThursday;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const weekNumber = 1 + Math.floor(diffDays / 7); // Floor instead of Ceil for cleaner math

  // Handle year boundary (week 52/53 or 1 of next/prev year)
  if (weekNumber < 1) {
    return getWeekNumber(new Date(Date.UTC(date.getUTCFullYear() - 1, 11, 31)));
  } else if (weekNumber > 52) {
    const jan1NextYear = new Date(Date.UTC(date.getUTCFullYear() + 1, 0, 1));
    const daysToFirstThursdayNext = (4 - jan1NextYear.getUTCDay() + 7) % 7;
    const weekMax =
      jan1NextYear.getUTCDate() + daysToFirstThursdayNext >= 4 ? 53 : 52;
    if (weekNumber > weekMax) {
      return 1; // Belongs to week 1 of next year
    }
  }

  return weekNumber;
}

async function populate() {
  const startYear = +process.argv[2];
  const endYear = +process.argv[3];

  await populateDateDimension(startYear, endYear);
}

module.exports = populateDateDimension;
