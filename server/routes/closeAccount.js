const express = require("express");

const router = express.Router();

const validateLogin = require("../middleware/validateLogin");

const accounts = require("../data/accounts");

router.post("/", validateLogin, (req, res) => {
  const { username, pin } = req.body;
  const currentAccount = accounts.find(
    (acc) => acc.username === username && acc.pin === pin,
  );
  //find index of current account
  const index = accounts.findIndex(
    (acc) => acc.username === currentAccount.username,
  );
  //remove account from accounts array by index
  accounts.splice(index, 1);
  console.log(accounts);

  res.status(200).json({
    message: "Account close success",
  });
});

module.exports = router;
