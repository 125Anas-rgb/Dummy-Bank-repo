const accounts = require("../data/accounts");

const prisma = require("../config/db");

const validateTransfer = async (req, res, next) => {
  //getting from user inputs (in JSON format)
  const { senderUsername, receiveUsername, amount } = req.body;

  //performing opearions from accounts data
  const senderAcc = await prisma.user.findUnique({
    where: {
      username: senderUsername,
    },
  });
  const recieverAcc = await prisma.user.findUnique({
    where: {
      username: receiveUsername,
    },
  });

  function calcDisplayBalance(acc) {
    //new object key
    acc.balance = acc.movements.reduce((acc, cur) => {
      return acc + cur;
    }, 0);
    return acc.balance;
  }
  const senderBalnce = calcDisplayBalance(senderAcc);

  if (
    amount <= 0 ||
    !recieverAcc ||
    senderBalnce <= amount ||
    recieverAcc?.username === senderAcc.username
  ) {
    return res.status(400).json({
      error: "Wrong Account",
    });
  }
  next();
};

module.exports = validateTransfer;
