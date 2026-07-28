const accounts = require("../data/accounts");

const validateId = function (req, res, next) {
  const id = Number(req.params.id);
  const account = accounts.find((acc) => acc.id === id);

  if (!account) {
    return res.status(404).json({
      error: "Account Not Found",
    });
  }

  next();
};

module.exports = validateId;
