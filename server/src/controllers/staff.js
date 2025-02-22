const staffSchema = require("../validators/staff");
const prisma = require("../../prisma/main/client");
const { hashPassword } = require("../utils/auth");

async function createStaff(req, res, next) {
  try {
    const staffData = req.body.staff;
    const adminData = req.user;
    if (!staffData) return res.status(400).json({ message: "Missing data" });

    //validating data credentials
    let { value, error } = staffSchema.validate(staffData);
    if (error)
      return res.status(400).json({ message: error.details[0].message });
    staffData.phoneNumber = value.phoneNumber;

    //checking if the user already exists
    const existingUser = await prisma.User.findFirst({
      where: {
        OR: [
          { email: staffData.email },
          { username: staffData.username },
          { phoneNumber: staffData.phoneNumber },
        ],
      },
    });
    if (existingUser) {
      let duplicateField;
      if (existingUser.email === staffData.email) duplicateField = "email";
      else if (existingUser.username === staffData.username)
        duplicateField = "username";
      else duplicateField = "phone number";
      return res.status(400).json({
        message: `User with this ${duplicateField} already exists`,
      });
    }

    //hasing the password
    const hashedPassword = await hashPassword(staffData.password);

    // Create a staff
    const staff = await prisma.User.create({
      data: {
        name: staffData.name,
        email: staffData.email,
        username: staffData.username,
        password: hashedPassword,
        phoneNumber: staffData.phoneNumber,
        isAdmin: false,
        businessId: adminData.businessId,
      },
    });

    res.status(201).json({
      message: "Staff created successfully",
      Staff: {
        id: staff.id,
        email: staff.email,
      },
      business: {
        id: adminData.businessId,
      },
    });
  } catch (ex) {
    next(ex);
  }
}
async function deleteStaff(req, res, next) {
  const adminData = req.user;
  const userId = parseInt(req.params.userId);

  // Validate the user ID
  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    // Check if the user exists and is not an admin
    const user = await prisma.User.findFirst({
      where: {
        AND: [
          { id: userId },
          { businessId: adminData.businessId },
          { isAdmin: false },
        ],
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await prisma.User.delete({
      where: { id: userId },
    });

    res
      .status(200)
      .json({ message: `successfully deleted staff with id: ${userId}` });
  } catch (ex) {
    next(ex);
  }
}
async function listStaff(req, res, next) {
  const page = parseInt(req.query.page) || 1;
  const orderBy = req.query.orderBy || "name";
  const sortOrder = req.query.sortOrder || "asc";
  try {
    const users = await prisma.User.findMany({
      where: {
        AND: [{ isAdmin: false }, { businessId: req.user.businessId }],
      },
      skip: (page - 1) * 5,
      take: 5,
      orderBy: { [orderBy]: sortOrder },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        phoneNumber: true,
        createdAt: true,
      },
    });
    res.status(200).json({ message: "Success", data: users });
  } catch (ex) {
    next(ex);
  }
}
module.exports = { createStaff, deleteStaff, listStaff };
