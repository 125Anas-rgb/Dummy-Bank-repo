const express = require("express");

const router = express.Router();

const accounts = require("../data/accounts");

const prisma = require("../config/db");

router.post("/", async (req, res) => {
  //getting from user inputs (in JSON format)
  const { username, amount } = req.body;

  const currentAccount = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (amount > 0 && currentAccount.movements.some((mov) => mov > amount / 10)) {
    await prisma.user.update({
      where: {
        username,
      },
      data: {
        movements: {
          push: amount,
        },
        movementsDates: {
          push: new Date(),
        },
      },
    });
    // currentAccount.movements.push(amount);
    // currentAccount.movementsDates.push(new Date().toISOString());
  }

  res.status(200).json(currentAccount);
});

module.exports = router;
