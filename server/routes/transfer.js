const express = require("express");

const router = express.Router();

const validateTransfer = require("../middleware/validateTransfer");

const accounts = require("../data/accounts");

const prisma = require("../config/db");
// const { push } = require("node:stream/iter");

router.post("/", validateTransfer, async (req, res) => {
  const { senderUsername, receiveUsername, amount } = req.body;

  const senderAcc = await prisma.user.update({
    where: {
      username: senderUsername,
    },
    data: {
      movements: {
        push: -amount,
      },
      movementsDates: {
        push: new Date(),
      },
    },
  });

  const receiveAcc = await prisma.user.update({
    where: {
      username: receiveUsername,
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

  console.log(senderAcc.movements);
  console.log(senderAcc.movementsDates);

  res.status(200).json(senderAcc);
});

module.exports = router;
