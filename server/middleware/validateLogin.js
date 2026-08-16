const accounts = require("../data/accounts");

const prisma = require("../config/db");

const validateLogin = async function (req, res, next) {
  //getting from user inputs (in JSON format)
  const { username, pin } = req.body;

  if (!username || !pin) {
    res.status(400).json({
      error: "Please fill all the fields",
    });
  }

  const user = await prisma.user.findFirst({
    where: {
      username,
      pin,
    },
  });

  if (!user) {
    res.status(400).json({
      error: "Account doesnt exist",
    });
  }

  next();
};

module.exports = validateLogin;
