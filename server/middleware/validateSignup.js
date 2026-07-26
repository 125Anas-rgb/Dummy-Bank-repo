const accounts = require("../data/accounts");

const validateSignup = (req, res, next) => {
  const { owner, pin } = req.body;

  const sameUser = accounts.some(
    (account) => account.owner === owner && account.pin === Number(pin),
  );
  if (sameUser)
    return res.status(400).json({
      error: "Account already exists",
    });

  if (!owner || !pin)
    return res.status(400).json({
      error: "Please fill the required fields",
    });
  next();
};

module.exports = validateSignup;
