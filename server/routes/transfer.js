const express = require("express");

const router = express.Router();

const validateTransfer = require("../middleware/validateTransfer");

const accounts = require("../data/accounts");

router.post("/", validateTransfer, (req, res) => {
  const { sender, receiveUsername, amount } = req.body;

  const senderAcc = accounts.find((acc) => acc.username === sender);
  const receiveAcc = accounts.find((acc) => acc.username === receiveUsername);
  console.log(receiveAcc);

  senderAcc.movements.push(-amount);
  receiveAcc.movements.push(amount);

  senderAcc.movementsDates.push(new Date().toISOString());
  receiveAcc.movementsDates.push(new Date().toISOString());

  console.log(senderAcc.movements);
  console.log(senderAcc.movementsDates);

  res.status(200).json(senderAcc);
});

module.exports = router;
