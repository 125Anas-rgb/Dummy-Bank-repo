const express = require("express");

//Router() is a function provided by Express that creates a mini Express application.
//creates a router object.
//It does NOT create a server.
//It only collects routes.
const router = express.Router();

//getting middleware (defining path)
const validateSignup = require("../middleware/validateSignup");

const accounts = require("../data/accounts");

router.post("/", validateSignup, (req, res) => {
  //server recieves req.body as inputs from user
  const { owner, pin } = req.body;

  const createUsername = (owner) =>
    owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");

  const newAccount = {
    id: accounts.length + 1,
    owner,
    pin,
    username: createUsername(owner),
    interestRate: 1,
    movements: [200, 300, 500],
    movementsDates: [
      new Date().toISOString(),
      new Date().toISOString(),
      new Date().toISOString(),
    ],
    currency: "EUR",
    locale: "en-QA",
  };

  accounts.push(newAccount);
  console.log(accounts);

  res.status(201).json(newAccount);
});

module.exports = router;
