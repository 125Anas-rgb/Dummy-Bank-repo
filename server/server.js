//CommonJS import is require
const express = require("express");

//allow requests from other origins
const cors = require("cors");

const accounts = require("./data/accounts");

//getting all middlewares (Defining all paths)
const validateSignup = require("./middleware/validateSignup");
const validateLogin = require("./middleware/validateLogin");
const validateTransfer = require("./middleware/validateTransfer");

// Getting all Routes (Defining all paths)
const signupRoute = require("./routes/signup");
const loginRoute = require("./routes/login");
const transferRoute = require("./routes/transfer");
const loanRoute = require("./routes/loan");
const closeAccRoute = require("./routes/closeAccount");

//This creates the main Express application.
const app = express();

app.use(cors());

//Start listening on port 3000
app.listen(3000);

app.use(express.json());

//when url starts gets string api/anyPath (route)(API URL path), send the rest to this router variable
app.use("/api/signup", signupRoute);
app.use("/api/login", loginRoute);
app.use("/api/transfer", transferRoute);
app.use("/api/loan", loanRoute);
app.use("/api/closeAcc", closeAccRoute);

app.get("/api/message", (req, res) => {
  res.json({ message: "Hey yo Welcome to Bank server" });
});

app.post("/api/closeAcc", validateLogin, (req, res) => {
  const { username, pin } = req.body;
  const currentAccount = accounts.find(
    (acc) => acc.username === username && acc.pin === pin,
  );
  //find index of current account
  const index = accounts.findIndex(
    (acc) => acc.username === currentAccount.username,
  );
  //remove account from accounts array by index
  accounts.splice(index, 1);
  console.log(accounts);

  res.status(200).json({
    message: "Account close success",
  });
});

//For your Dummy Bank, the main ones you used:
// 200 → Login, transfer, account operations successful.
// 201 → New account created during signup.
// 400 → Wrong input (duplicate account, invalid transfer).
// 404 → Account/user not found.
// 500 → Backend/server failure.
