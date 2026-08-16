const express = require("express");

//Router() is a function provided by Express that creates a mini Express application.
//creates a router object.
//It does NOT create a server.
//It only collects routes.
const router = express.Router();

//getting middleware (defining path)
const validateSignup = require("../middleware/validateSignup");

// const accounts = require("../data/accounts");
const prisma = require("../config/db");

router.post("/", validateSignup, async (req, res) => {
  //server recieves req.body as inputs from user
  const { email, owner, pin } = req.body;

  const createUsername = (owner) =>
    owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("") + Math.floor(100 + Math.random() * 900);
  //whenecer user sign ups it cretes new object of account

  const newAccount = await prisma.user.create({
    data: {
      email,
      owner,
      pin,
      username: createUsername(owner),
      interestRate: 1,
      movements: [100, 200, 500],
      movementsDates: [
        new Date().toISOString(),
        new Date().toISOString(),
        new Date().toISOString(),
      ],
      currency: "EUR",
      locale: "en-QA",
    },
  });

  console.log(createUsername(newAccount.owner));

  // const newAccount = {
  //   id: newId++,
  //   email,
  //   owner,
  //   pin,
  //   username: createUsername(owner),
  //   interestRate: 1,
  //   movements: [200, 300, 500],
  //   movementsDates: [
  //     new Date().toISOString(),
  //     new Date().toISOString(),
  //     new Date().toISOString(),
  //   ],
  //   currency: "EUR",
  //   locale: "en-QA",
  // };

  //add in main accounts array
  const dbAccounts = await prisma.user.findMany();
  console.log(dbAccounts);

  res.status(201).json(newAccount);
});

module.exports = router;
