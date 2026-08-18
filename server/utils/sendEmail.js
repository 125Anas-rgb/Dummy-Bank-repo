const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async function ({ to, subject, html }) {
  const info = await transporter.sendMail({
    from: "Dummy Bank",
    to,
    subject,
    html,
  });

  console.log("Email Sent:", info.messageId);
  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
};

module.exports = sendEmail;
