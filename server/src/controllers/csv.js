const client = require("../../prisma/main/client");
const listSubmissions = async (req, res) => {
  try {
    const submissions = await client.cSVStatus.findMany({
      where: {
        businessId: req.user.businessId,
      },
      select: {
        id: true,
        status: true,
        uploadedDate: true,
        errors: true,
      },
    });
    return res.status(200).json({ data: submissions });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = listSubmissions;
