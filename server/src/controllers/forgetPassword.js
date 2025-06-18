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
    const token = await generateToken(user, "10m");
    const resetLink = `http://localhost:5173/resetpassword?token=${token}`; //frontend URL
    const subject = "Reset Your Password";
    const text = `
                         <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <p>Dear ${user.name},</p>

        <p>We received a request to reset your password. Click the link below to create a new password:</p>

        <p><a href="${resetLink}" style="color: #007bff; text-decoration: none;">Reset Password</a></p>

        <p>If you did not request a password reset, please ignore this email. This link will expire in 10 minutes for security reasons.</p>


        <p>If you need further assistance, feel free to contact our support team.</p>

        <p>Best regards,<br>Smart Inventory Team </p>
      </body>
      </html>`;
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
