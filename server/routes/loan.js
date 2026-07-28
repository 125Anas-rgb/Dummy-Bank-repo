const express = require("express");

const router = express.Router();

const accounts = require("../data/accounts");

router.post("/", (req, res) => {
  //getting from user inputs (in JSON format)
  const { username, amount } = req.body;

  const currentAccount = accounts.find((acc) => acc.username === username);

  if (amount > 0 && currentAccount.movements.some((mov) => mov > amount / 10)) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
  }

  res.status(200).json(currentAccount);
});

module.exports = router;
