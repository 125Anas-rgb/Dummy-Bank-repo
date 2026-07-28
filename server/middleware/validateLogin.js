const accounts = require("../data/accounts");

const validateLogin = function (req, res, next) {
  //getting from user inputs (in JSON format)
  const { username, pin } = req.body;

  if (!username) {
    res.status(400).json({
      error: "Username is wrong",
    });
  }
  if (!pin) {
    res.status(400).json({
      error: "pin is wrong",
    });
  }
  next();
};

module.exports = validateLogin;
