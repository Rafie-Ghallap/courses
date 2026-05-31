const express = require("express");
const router = express.Router();

const { orderModel } = require("../models/order");

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
     await orderModel.findOneAndUpdate(
      {
        paymob_order_id: order,
      },
      {
        status: "paid",
      }
    );
    return res.redirect(`${process.env.FRONTEND_URL}/6a153cad36ff5e7186838c00?type=paid`);
  }
 
  res.redirect(`${process.env.FRONTEND_URL}/payment/failed?order=${order}`);
});

module.exports = router;
