const express = require("express");
const router = express.Router();

const accounts = require("../data/accounts");
const validate = require("../../../../notes/backend/backend-tasks/middleware/validate");
const validateId = require("../middleware/validateId");

router.get("/", (req, res) => {
  res.json(accounts);
});

router.get("/:id", validateId, (req, res) => {
  const id = Number(req.params.id);

  const account = accounts.find((acc) => acc.id === id);

  res.status(200).json(account);
});

router.put("/:id", validateId, (req, res) => {
  const id = Number(req.params.id);
  let maxLength = 4;
  const account = accounts.find((acc) => acc.id === id);

  let insertedPin = req.body.pin;
  let correctPin = Number(insertedPin.toString().slice(0, maxLength));
  account.pin = correctPin;

  res.status(200).json(account);
});

router.delete("/:id", validateId, (req, res) => {
  const id = Number(req.params.id);

  const index = accounts.findIndex((acc) => acc.id === id);

  // const remAccounts = accounts.filter((acc) => acc.id !== id);
  accounts.splice(index, 1);
  res.status(200).json({ message: "Account Deleted Successfully" });
});

module.exports = router;
