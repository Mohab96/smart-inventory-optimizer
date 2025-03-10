const dwhClient = require("../../prisma/dwh/client");

const getTransactionHistory = async (req, res) => {
  const queryDate = req.query.date || new Date().toISOString();
  const businessId = req.user.businessId;

  try {
    const dateObj = new Date(queryDate);

    // Build the start/end of the day (midnight to midnight)
    const startOfDay = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth(),
      dateObj.getDate(),
      0,
      0,
      0,
      0
    );
    const endOfDay = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth(),
      dateObj.getDate() + 1,
      0,
      0,
      0,
      0
    );

    const transactions = await dwhClient.transactionFact.findMany({
      where: {
        businessId: businessId,
        date: {
          fullDate: {
            gte: startOfDay.toISOString(),
            lt: endOfDay.toISOString(),
          },
        },
      },
      include: {
        date: true,
        product: true,
        business: true,
      },
    });
    res.status(200).json({ data: transactions });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = getTransactionHistory;
