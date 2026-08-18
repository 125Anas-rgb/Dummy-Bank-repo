const accounts = require("../data/accounts");

const prisma = require("../config/db");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const validateLogin = async function (req, res, next) {
  //getting from user inputs (in JSON format)
  const { username, pin } = req.body;

  if (!username || !pin) {
    return res.status(400).json({
      error: "Please fill all the fields",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return res.status(400).json({
      error: "Account doesnt exist",
    });
  }

  const correctPin = await bcrypt.compare(String(pin), user.pin);

  if (!correctPin) {
    return res.status(400).json({
      error: "Incorrect credentials",
    });
  }

  if (!user.isVerified) {
    return res.status(400).json({
      error: "Verify Email before logging in",
    });
  }

  next();
};

module.exports = validateLogin;
