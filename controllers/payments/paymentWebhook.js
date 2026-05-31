const crypto = require("crypto");

const { orderModel } = require("../../models/order");
const { enrollmentModel } = require("../../models/enrollment");

// HMAC verification (important for security)
const verifyHmac = (body) => {
  const hmacSecret = process.env.PAYMOB_HMAC_SECRET;

  const {
    amount_cents,
    created_at,
    currency,
    error_occured,
    has_parent_transaction,
    id,
    integration_id,
    is_3d_secure,
    is_auth,
    is_capture,
    is_refunded,
    is_standalone_payment,
    is_voided,
    order,
    owner,
    pending,
    success,
  } = body.obj;

  const concatenatedString =
    amount_cents +
    created_at +
    currency +
    error_occured +
    has_parent_transaction +
    id +
    integration_id +
    is_3d_secure +
    is_auth +
    is_capture +
    is_refunded +
    is_standalone_payment +
    is_voided +
    order.id +
    owner +
    pending +
    success;

  const hashed = crypto
    .createHmac("sha512", hmacSecret)
    .update(concatenatedString)
    .digest("hex");

  return hashed === body.hmac;
};

const paymentWebhook = async (req, res) => {
  try {
    const body = req.body;

    // 1) verify HMAC
    const isValid = verifyHmac(body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid HMAC",
      });
    }

    const obj = body.obj;

    const orderId = obj.order.id;
    const isSuccess = obj.success;

    // 2) find order
    const order = await orderModel.findOne({
      transactionId: orderId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 3) if payment success
    if (isSuccess) {
      order.status = "paid";
      await order.save();

      // create enrollment
      const exists = await enrollmentModel.findOne({
        student_id: order.student_id,
        course_id: order.course_id,
      });

      if (!exists) {
        await enrollmentModel.create({
          student_id: order.student_id,
          course_id: order.course_id,
        });
      }
    } else {
      order.status = "failed";
      await order.save();
    }
    console.log(
      "Payment webhook processed for order:",
      orderId,
      "Success:",
      isSuccess,
    );
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = paymentWebhook;
