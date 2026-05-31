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

module.exports = router;