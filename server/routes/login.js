const express = require("express");

const router = express.Router();

const validateLogin = require("../middleware/validateLogin");

const accounts = require("../data/accounts");

router.post("/", validateLogin, (req, res) => {
  //server recieves req.body as inputs from user
  const { username, pin } = req.body;
  const currentAccount = accounts.find(
    (acc) => acc.username === username && acc.pin === pin,
  );
  res.status(200).json(currentAccount);
  console.log(currentAccount);
});

module.exports = router;
