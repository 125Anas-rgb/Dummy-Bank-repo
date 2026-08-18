const express = require("express");

const router = express.Router();

const prisma = require("../config/db");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

router.get("/", async (req, res) => {
  const { token, email } = req.query;

  const hashToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      verificationToken: hashToken,
    },
  });

  if (!user) {
    return res.status(400).json({
      error: "Invalid verification token",
    });
  }

  if (user.verificationTokenExpires < new Date()) {
    return res.status(400).json({
      error: "Verification token expired",
    });
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpires: null,
    },
  });

  res.status(200).json({
    message: "Email verified successfully , now you can login",
  });
});

module.exports = router;
