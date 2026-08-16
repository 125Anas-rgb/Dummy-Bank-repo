const accounts = require("../data/accounts");

const prisma = require("../config/db");

const validateSignup = async (req, res, next) => {
  const { email, owner, pin } = req.body;

  if (!email || !owner || !pin) {
    res.status(400).json({
      error: "Please fill all the fields",
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(401).json({
      error: "Please enter a valid email",
    });
  }

  if (typeof owner !== "string") {
    return res.status(400).json({
      message: "Name must be a String",
    });
  }

  if (existingUser)
    return res.status(400).json({
      error: "Account already exists",
    });

  if (!owner || !pin || !email)
    return res.status(400).json({
      error: "Please fill the required fields",
    });
  next();
};

module.exports = validateSignup;
