const prisma = require("../../prisma/main/client");
const { sendMail } = require("../utils/SendingEmails");
const { generateToken } = require("../utils/auth");
async function forgetPassword(req, res, next) {
  try {
    const userData = req.body;
    let user = await prisma.User.findUnique({
      where: { email: userData.email },
    });
    if (!user)
      return res
        .status(404)
        .json({ message: "We could not find user with given email" });
    const token = generateToken(user, "10m");
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`; //frontend URL
    const subject = "Reset Your Password";
    const text = `
                    Dear ${user.name},

                    We received a request to reset your password. Click the link below to create a new password:

                    <a href="${resetLink}">Reset Password</a>

                    If you did not request a password reset, please ignore this email. This link will expire in 10 minutes for security reasons.

                    If you need further assistance, feel free to contact our support team.

                    Best regards,
                    Smart Inventory Team`;
    sendMail(user, subject, text);
    return res.status(201).set("Authorization", `Bearer ${token}`).json({
      message: "Success",
      token,
    });
  } catch (ex) {
    next(ex);
  }
}

module.exports = { forgetPassword };
