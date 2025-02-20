const loginSchema = require("../validators/login");
const bcrypt = require("bcrypt");
const prisma = require("../../prisma/main/client");
const { generateToken } = require("../utils/auth");

async function login(req, res, next) {
  const userData = req.body;

  try {
    //validating data credentials

    const { error } = loginSchema.validate(userData);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    //checking if the user already exists
    const user = await prisma.User.findUnique({
      where: { username: userData.username },
    });
    if (!user)
      return res
        .status(400)
        .json({ message: "Username or password is incorrect" });
    const match = await bcrypt.compare(userData.password, user.password);
    if (!match) {
      return res
        .status(400)
        .json({ message: "Username or password is incorrect" });
    }

    ///JWT
    const token = generateToken(user);

    res
      .status(200)
      .set("Authorization", `Bearer ${token}`) // Attach the token to the header
      .json({
        message: "Login successfully",
        token,
      });
  } catch (ex) {
    next(ex);
  }
}
module.exports = { login };
