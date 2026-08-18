const express = require("express");

const router = express.Router();

const prisma = require("../config/db");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const sendEmail = require("../utils/sendEmail");

router.post("/", async (req, res) => {
  //getting email from front-end
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      error: "Please enter an email",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: "Please enter a valid email",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(200).json({
      message: "If an account exists, a reset link has been sent.",
    });
  }

  //creating token and its expiration for reset pin (that will be sent with link to later compare when user reset pin)
  const rawToken = crypto.randomBytes(32).toString("hex");

  //storing its hash in db
  const hashToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  const pinResetExpires = new Date(Date.now(5 * 60 * 1000));

  //inserting token and its expiration into user db so that no other can get  (it will check for token)
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      pinResetToken: hashToken,
      pinResetExpires,
    },
  });

  const resetLink =
    //opens html page but we have (contains token and email) the reset page auto loaded once we get raw token from link
    `http://127.0.0.1:5500/Dummy-Bank-repo/client/index.html` +
    `?resetToken=${rawToken}&email=${encodeURIComponent(user.email)}`;

  await sendEmail({
    to: user.email,
    subject: "Reset Pin",
    html: `<h1>Welcome To Dummy Bank Application</h1>
    
          <p>Pin reset request was generated for this email</p>

          <p>Click the link below to reset your pin</p>
          <p> <a href=${resetLink}>
             Verify Email </a> </p>

          <p> This verification Link expires in 5 mints </p>`,
  });

  return res.status(200).json({
    message: "If an account exists, a reset link has been sent.",
  });
});

module.exports = router;
