const nodemailer = require("nodemailer");
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
    ["html"]: emailText,
  };

  transporter.sendMail(mailOptions, function (error) {
    if (error) {
      winston.error(error);
    } else {
      return;
    }
  });
};

module.exports = { sendMail };
