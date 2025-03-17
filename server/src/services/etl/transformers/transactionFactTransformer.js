const prisma = require("../../../../prisma/dwh/client");
const startOfDayUTC = (date) => {
  const d = new Date(date);
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  );
};
async function transactionFactTransformer(rawData) {
  try {
    const uniqueDates = [
      ...new Set(rawData.map((row) => startOfDayUTC(row.date).toISOString())),
    ].map((str) => new Date(str));

    const dateRecords = await prisma.DateDimension.findMany({
      where: {
        fullDate: { in: uniqueDates },
      },
      select: { dateId: true, fullDate: true },
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

    const transformedData = rawData.map((row) => {
      const dateStr = startOfDayUTC(row.date).toISOString();
      const dateId = dateIdMap[dateStr];
      return {
        transactionId: Number(row.id),
        businessId: row.batchRelation.productRelation.businessId,
        productId: Number(row.batchRelation.productId),
        dateId: dateId,
        amount: Number(row.amount),
        discount: Number(row.discount),
      };
    });

    return transformedData;
  } catch (error) {
    console.error("Transformation failed:", error);
  }
}

module.exports = transactionFactTransformer;
