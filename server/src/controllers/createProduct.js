const mainClient = require("../../prisma/main/client");

const createProduct = async (req, res) => {
  const { name, categoryId } = req.body;

  const name_exists = await mainClient.product.findFirst({
    where: {
      AND: [
        {
          name: name,
          businessId: req.user.businessId,
        },
      ],
    },
  });

  if (name_exists) {
    return res.status(400).json({
      error: "Product with this name already exists for this business",
    });
  }

  const category = await mainClient.category.findFirst({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    return res.status(400).json({
      error: "Category not found",
    });
  }

  try {
    const product = await mainClient.product.create({
      data: {
        name,
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });

    return res.status(201).json({
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Error creating product",
    });
  }
};

module.exports = createProduct;
