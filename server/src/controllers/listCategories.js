const winston = require("winston");
const mainClient = require("../../prisma/main/client");

const listCategories = async (req, res) => {
  try {
    const categories = await mainClient.category.findMany({});

    res.status(200).json(categories);
  } catch (error) {
    winston.error(error);

    res
      .status(500)
      .json({ error: "An error occurred while fetching categories" });
  }
};

module.exports = listCategories;
