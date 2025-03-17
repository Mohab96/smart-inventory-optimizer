const prisma = require("../../../../prisma/dwh/client");
const startOfDayUTC = require("../../../utils/startOfDayUTC");

async function categoryRevenueFactTransformer(rawData) {
  try {
    const uniqueDates = [
      ...new Set(rawData.map((row) => startOfDayUTC(row.date).toISOString())),
    ].map((str) => new Date(str));

    if (uniqueDates.length === 0) {
      return [];
    }

    const dateRecords = await prisma.DateDimension.findMany({
      where: {
        fullDate: {
          in: uniqueDates,
        },
      },
      select: {
        dateId: true,
        fullDate: true,
      },
    });

    const fetchedDateStrs = new Set(
      dateRecords.map((record) => record.fullDate.toISOString())
    );
    const missingDates = uniqueDates.filter(
      (date) => !fetchedDateStrs.has(date.toISOString())
    );
    if (missingDates.length > 0) {
      throw new Error(
        `No DateDimension entries for dates: ${missingDates
          .map((d) => d.toISOString())
          .join(", ")}`
      );
    }

    const dateIdMap = {};
    dateRecords.forEach((record) => {
      dateIdMap[record.fullDate.toISOString()] = record.dateId;
    });

    const transformedData = rawData.map((record) => {
      const normalizedDateStr = startOfDayUTC(record.date).toISOString();
      const dateId = dateIdMap[normalizedDateStr];
      return {
        businessId: record.businessId,
        categoryId: Number(record.categoryId),
        dateId: dateId,
        revenueAmount: Number(record.revenueAmount) || 0,
        totalUnitsSold: Number(record.totalUnitsSold),
      };
    });

    return transformedData;
  } catch (error) {
    console.error("Transformation failed:", error);
  }
}

module.exports = categoryRevenueFactTransformer;
