const express = require("express");

const router = express.Router();

const validateLogin = require("../middleware/validateLogin");

const accounts = require("../data/accounts");
const prisma = require("../config/db");

router.post("/", validateLogin, async (req, res) => {
  const { email, pin } = req.body;
  const currentAccount = await prisma.user.delete({
    where: {
      email,
    },
  });
  // //find index of current account
  // const index = accounts.findIndex(
  //   (acc) => acc.username === currentAccount.username,
  // );
  // //remove account from accounts array by index
  // accounts.splice(index, 1);

  res.status(200).json({
    message: "Account close success",
  });
});

module.exports = router;
