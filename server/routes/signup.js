const express = require("express");

//Router() is a function provided by Express that creates a mini Express application.
//creates a router object.
//It does NOT create a server.
//It only collects routes.
const router = express.Router();

//getting middleware (defining path)
const validateSignup = require("../middleware/validateSignup");

const sendEmail = require("../utils/sendEmail");

// const accounts = require("../data/accounts");
const prisma = require("../config/db");

const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

  let username = createUsername(owner);

  let existingUsername = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  const hashPin = await bcrypt.hash(String(pin), 10);

  //if username exists (generate again)
  while (existingUsername) {
    //create username again
    username = createUsername(owner);

    //check again
    existingUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  const rawToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const verificationTokenExpires = new Date(Date.now() + 30 * 60 * 1000);

  const newAccount = await prisma.user.create({
    data: {
      email,
      owner,
      pin: hashPin,
      username,
      verificationToken: hashedToken,
      verificationTokenExpires,
      movements: [100, 200, 500],
      movementsDates: [
        new Date().toISOString(),
        new Date().toISOString(),
        new Date().toISOString(),
      ],
      interestRate: 1,
      currency: "EUR",
      locale: "en-QA",
    },
  });

  const verificationLink =
    `http://localhost:3000/api/verify-email` +
    `?token=${rawToken}&email=${encodeURIComponent(newAccount.email)}`;

  await sendEmail({
    to: newAccount.email,
    subject: "Verify Email",
    html: `<h1>Welcome To Dummy Bank Application</h1>
    
          <p>Please verify your email before completing registration</p>

          <p>Click the link below to verify your email</p>
          <p> <a href=${verificationLink}>
             Verify Email </a> </p>

          <p> This verification Link expires in 30 mints </p>`,
  });

  console.log(createUsername(newAccount.owner));

  //add in main accounts array
  const dbAccounts = await prisma.user.findMany();
  console.log(dbAccounts);
  return res.status(201).json(newAccount);
});

module.exports = router;
