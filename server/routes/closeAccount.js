const express = require("express");

const router = express.Router();

const validateLogin = require("../middleware/validateLogin");

const sendEmail = require("../utils/sendEmail");

const accounts = require("../data/accounts");
const prisma = require("../config/db");
const crypto = require("crypto");

router.post("/", async (req, res) => {
  const { email, pin } = req.body;

  const currentAccount = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  const rawToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const verificationTokenExpires = new Date(Date.now() + 5 * 60 * 1000);
  const pinResetExpires = new Date(Date.now(5 * 60 * 1000));

  const verificationLink =
    `http://localhost:3000/api/verify-delete` +
    `?token=${rawToken}&email=${encodeURIComponent(currentAccount.email)}`;

  const resetLink =
    //opens html page but we have (contains token and email) the reset page auto loaded once we get raw token from link
    `http://127.0.0.1:5500/Dummy-Bank-repo/client/index.html` +
    `?resetToken=${rawToken}&email=${encodeURIComponent(currentAccount.email)}`;

  await prisma.user.update({
    where: {
      id: currentAccount.id,
    },
    data: {
      verificationToken: hashedToken,
      verificationTokenExpires,
      pinResetToken: hashedToken,
      pinResetExpires,
    },
  });

  await sendEmail({
    to: currentAccount.email,
    subject: "Verify Email",
    html: `<h1>Welcome To Dummy Bank Application</h1>
    
          <p>An Account deletion request was Submitted</p>

          <p>Note if you did not make this request,it is required to immediately change your pin</p>
          <p> <a href=${resetLink}> 
          Reset Pin </a> </p>

          <p>Click the link below to verify your accoun deletion</p>
          <p> <a href=${verificationLink}>
             Delete Account </a> </p>

          <p> This verification Link expires in 5 mints </p>`,
  });

  console.log(currentAccount);
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
