const express = require("express");

const router = express.Router();

const prisma = require("../config/db");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const sendEmail = require("../utils/sendEmail");

router.post("/", async (req, res) => {
  //receives frontend and backend values
  //token from the link it contained
  //newpin from the input user typed it in
  const { token, newPin } = req.body;

  if (!token || !newPin) {
    return res.status(200).json({
      error: "Please enter new pin",
    });
  }

  //creatign hash to compare with it
  const hashToken = crypto.createHash("sha256").update(token).digest("hex");

  //verifies the token
  const user = await prisma.user.findFirst({
    where: {
      pinResetToken: hashToken,
    },
  });

  if (!user) {
    return res.status(400).json({
      error: "Invalid reset token",
    });
  }

  if (user.resetTokenExpires < new Date()) {
    return res.status(400).json({
      error: "Reset token expired",
    });
  }

  //creating hash to store in pin
  const hashPin = await bcrypt.hash(String(newPin), 10);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      pin: hashPin,
      pinResetToken: null,
      pinResetExpires: null,
    },
  });
  return res.status(200).json({
    message: "PIN reset successfully. You can now login.",
  });
});

module.exports = router;
