const express = require("express");
const router = express.Router();

const {checkAuth} = require(
  "../middleware/checkAuth"
);

const createPayment = require(
  "../controllers/payments/createPayment"
);

const paymentWebhook = require(
  "../controllers/payments/paymentWebhook"
);

router.post(
  "/buy-course",
  checkAuth,
  createPayment
);

router.post(
  "/webhook",
  paymentWebhook
);

router.get("/response", (req, res) => {
  const { success, order, id: transactionId } = req.query;
 
  if (success === "true") {
    // Redirect to a success page on your frontend
    return res.redirect(`${process.env.FRONTEND_URL}/payment/success?order=${order}`);
  }
 
  res.redirect(`${process.env.FRONTEND_URL}/payment/failed?order=${order}`);
});

module.exports = router;