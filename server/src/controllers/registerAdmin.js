const adminSchema = require("../validators/admin");
const businessSchema = require("../validators/business");
const prisma = require("../../prisma/main/client");
const dwhprisma = require("../../prisma/dwh/client");
const { hashPassword, generateToken } = require("../utils/auth");
const winston = require("winston");
async function deleteMainDbRecords(adminId, businessId) {
  try {
    await prisma.$transaction(async (prisma) => {
      await prisma.User.delete({
        where: { id: adminId },
      });
      await prisma.Business.delete({
        where: { id: businessId },
      });
    });
  } catch (error) {
    winston.error("Failed to delete main DB records:", error);
  }
}
async function createAdmin(req, res, next) {
  try {
    const { admin: adminData, business: businessData } = req.body;
    if (!adminData || !businessData)
      return res.status(400).json({ message: "Missing data" });

    //validating data credentials
    let { value, error } = adminSchema.validate(adminData);
    if (error)
      return res.status(400).json({ message: error.details[0].message });
    adminData.phoneNumber = value.phoneNumber;

    error = businessSchema.validate(businessData).error;
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    //checking if the user already exists
    const existingUser = await prisma.User.findFirst({
      where: {
        OR: [
          { email: adminData.email },
          { username: adminData.username },
          { phoneNumber: adminData.phoneNumber },
        ],
      },
    });
    if (existingUser) {
      let duplicateField;
      if (existingUser.email === adminData.email) duplicateField = "email";
      else if (existingUser.username === adminData.username)
        duplicateField = "username";
      else duplicateField = "phone number";
      return res.status(400).json({
        message: `User with this ${duplicateField} already exists`,
      });
    }

    //hashing the password
    const hashedPassword = await hashPassword(adminData.password);

    // Using a transaction to ensure atomicity
    const [business, admin] = await prisma.$transaction(async (prisma) => {
      // Create the business in the DB
      const business = await prisma.Business.create({
        data: {
          name: businessData.name,
          establishmentDate: businessData.establishmentDate,
          description: businessData.description,
        },
      });

      // Create the admin in the DB
      const admin = await prisma.User.create({
        data: {
          name: adminData.name,
          email: adminData.email,
          username: adminData.username,
          password: hashedPassword,
          phoneNumber: adminData.phoneNumber,
          isAdmin: true,
          businessId: business.id,
        },
      });

      return [business, admin];
    });

    ///JWT
    const token = await generateToken(admin);

    try {
      await dwhprisma.BusinessDimension.create({
        data: {
          businessId: business.id,
          businessName: business.name,
        },
      });
    } catch (dwhError) {
      await deleteMainDbRecords(admin.id, business.id);
      next(dwhError);
      return;
    }
    //Send the response with the JWT attached to the header
    res.status(201).json({
      message: "Admin and Business created successfully",
      token,
      admin: {
        id: admin.id,
        email: admin.email,
      },
      business: {
        id: business.id,
        name: business.name,
      },
    });
  } catch (ex) {
    next(ex);
  }
}
module.exports = { createAdmin };
