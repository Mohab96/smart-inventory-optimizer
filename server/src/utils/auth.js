const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const maindb = require("../../prisma/main/client");

const hashPassword = async (password, saltRounds = 10) => {
  return await bcrypt.hash(password, saltRounds);
};

const generateToken = async (user, expiration = "10h") => {
  console.log(user);
  const business = await maindb.business.findUnique({
    where: { id: user.businessId },
  });
  console.log("Business: ", business);
  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      businessName: business.name,
      isAdmin: user.isAdmin,
      businessId: user.businessId,
    },
    process.env.JWT_SECRET,
    { expiresIn: expiration }
  );
};

module.exports = { hashPassword, generateToken };
