const express = require("express");

const router = express.Router();

const validateLogin = require("../middleware/validateLogin");

const accounts = require("../data/accounts");

const prisma = require("../config/db");

router.post("/", validateLogin, async (req, res) => {
  //server recieves req.body as inputs from user
  const { username, pin } = req.body;
  const currentAccount = await prisma.user.findFirst({
    where: {
      username,
      pin,
    },
  });
  res.status(200).json(currentAccount);
  console.log(currentAccount);
});

module.exports = router;
