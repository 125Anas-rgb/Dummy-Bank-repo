const express = require("express");

const router = express.Router();

const validateLogin = require("../middleware/validateLogin");

const accounts = require("../data/accounts");

const prisma = require("../config/db");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/", validateLogin, async (req, res) => {
  //server recieves req.body as inputs from user
  const { username, pin } = req.body;

  const currentAccount = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  const token = jwt.sign(
    {
      userID: currentAccount.id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30m" },
  );

  return res.status(200).json({
    currentAccount,
    token,
  });
  console.log(currentAccount);
});

module.exports = router;
