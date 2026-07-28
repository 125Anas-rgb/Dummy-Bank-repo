const accounts = require("../data/accounts");

const validateTransfer = (req, res, next) => {
  //getting from user inputs (in JSON format)
  const { sender, receiveUsername, amount } = req.body;

  //performing opearions from accounts data
  const senderAcc = accounts.find((acc) => acc.username === sender);
  const receiveAcc = accounts.find((acc) => acc.username === receiveUsername);
  console.log(receiveAcc);

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
    !receiveAcc ||
    senderBalnce <= amount ||
    receiveAcc?.username === senderAcc
  ) {
    res.status(400).json({
      error: "account wrong",
    });
  }
  next();
};

module.exports = validateTransfer;
