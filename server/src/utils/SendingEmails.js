const nodemailer = require("nodemailer");
const { generateToken } = require("../utils/auth");
const winston = require("winston");

const sendMail = (user, Subject, emailText) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EmailAddress,
      pass: process.env.EmailPassword,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let mailOptions = {
    from: process.env.EmailAddress,
    to: user.email,
    subject: Subject,
    text: emailText,
  };

  transporter.sendMail(mailOptions, function (error) {
    if (error) {
      winston.error(error);
    } else {
      /// just for testing  -> we won't send token !!
      return;
    }
  });
};

module.exports = { sendMail };
