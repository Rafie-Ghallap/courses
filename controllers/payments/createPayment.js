const axios = require("axios");

const { coursesModel } = require("../../models/tracks/courses");
const { usersModel } = require("../../models/users/users");
const { enrollmentModel } = require("../../models/enrollment");
const { orderModel } = require("../../models/order");

// ─── Constants ────────────────────────────────────────────────────────────────

const PAYMOB_BASE_URL = "https://accept.paymob.com/api";
const VALID_PAYMENT_METHODS = ["card", "wallet"];
const PHONE_REGEX = /^\+?[0-9]{10,15}$/;

const DEFAULT_BILLING = {
  apartment: "NA",
  floor: "NA",
  street: "NA",
  building: "NA",
  shipping_method: "NA",
  postal_code: "NA",
  city: "Cairo",
  country: "EG",
  state: "Cairo",
};

// ─── Controller ───────────────────────────────────────────────────────────────

const createPayment = async (req, res) => {
  let order = null;

  try {
    const { courseId, paymentMethod, phone } = req.body;
    const student_id = req.user.id;

    // ── 1. Validate payment method ──────────────────────────────────────────
    if (!VALID_PAYMENT_METHODS.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "paymentMethod must be 'card' or 'wallet'",
      });
    }

    // ── 2. Validate phone for wallet payments ───────────────────────────────
    if (paymentMethod === "wallet" && (!phone || !PHONE_REGEX.test(phone))) {
      return res.status(400).json({
        success: false,
        message: "A valid phone number is required for wallet payment",
      });
    }

    

    // ── 3. Get course ───────────────────────────────────────────────────────
    const course = await coursesModel.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // ── 4. Validate course price ────────────────────────────────────────────
    if (course.isPaid && (!course.price || course.price <= 0)) {
      return res.status(400).json({
        success: false,
        message: "Course has an invalid price",
      });
    }

    // ── 5. Check if already enrolled ───────────────────────────────────────
    const alreadyEnrolled = await enrollmentModel.findOne({
      student_id,
      course_id: courseId,
    });

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    // ── 6. Free course => enroll directly ───────────────────────────────────
    if (!course.isPaid) {
      await enrollmentModel.create({
        student_id,
        course_id: courseId,
      });

      return res.status(200).json({
        success: true,
        freeCourse: true,
        message: "Enrolled successfully",
      });
    }

    // ── 7. Get user ─────────────────────────────────────────────────────────
    const user = await usersModel.findById(student_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ── 8. Idempotency check ────────────────────────────────────────────────
    // لو في pending order موجود => منعملش order جديد
    // بس نجدد الـ payment token على نفس الـ Paymob order القديم
    const existingOrder = await orderModel.findOne({
      student_id,
      course_id: courseId,
      status: "pending",
    });

    if (existingOrder) {
      order = existingOrder;

      // Step 1: auth token جديد
      const authResponse = await axios.post(`${PAYMOB_BASE_URL}/auth/tokens`, {
        api_key: process.env.PAYMOB_API_KEY,
      });
      const authToken = authResponse.data.token;

      // Step 2: payment key جديد على نفس الـ Paymob order القديم
      const integrationId =
        paymentMethod === "wallet"
          ? process.env.WALLET_INTEGRATION_ID
          : process.env.CARD_INTEGRATION_ID;

      const paymentKeyResponse = await axios.post(
        `${PAYMOB_BASE_URL}/acceptance/payment_keys`,
        {
          auth_token: authToken,
          amount_cents: existingOrder.amount * 100,
          expiration: 3600,
          order_id: existingOrder.transactionId,
          currency: "EGP",
          integration_id: integrationId,
          billing_data: {
            ...DEFAULT_BILLING,
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
            phone_number: user.phone,
          },
        },
      );
      const paymentToken = paymentKeyResponse.data.token;

      // Step 3: رجّع الـ URL
      if (paymentMethod === "wallet") {
        const walletResponse = await axios.post(
          `${PAYMOB_BASE_URL}/acceptance/payments/pay`,
          {
            source: { identifier: phone, subtype: "WALLET" },
            payment_token: paymentToken,
          },
        );
        return res.status(200).json({
          success: true,
          resumed: true,
          redirectUrl: walletResponse.data.redirect_url,
        });
      }

      const paymentUrl = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentToken}`;
      return res.status(200).json({
        success: true,
        resumed: true,
        paymentUrl,
      });
    }

    // ── 9. Create local order ───────────────────────────────────────────────
    order = await orderModel.create({
      student_id,
      course_id: courseId,
      amount: course.price,
      paymentMethod,
      status: "pending",
    });

    const amountCents = course.price * 100;

    // ── 10. Step 1: auth token ──────────────────────────────────────────────
    const authResponse = await axios.post(`${PAYMOB_BASE_URL}/auth/tokens`, {
      api_key: process.env.PAYMOB_API_KEY,
    });
    const authToken = authResponse.data.token;

    // ── 11. Step 2: create Paymob order ────────────────────────────────────
    const paymobOrderResponse = await axios.post(
      `${PAYMOB_BASE_URL}/ecommerce/orders`,
      {
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: amountCents,
        currency: "EGP",
        items: [],
      },
    );

    order.transactionId = paymobOrderResponse.data.id;
    await order.save();

    // ── 12. Step 3: payment key ─────────────────────────────────────────────
    const integrationId =
      paymentMethod === "wallet"
        ? process.env.WALLET_INTEGRATION_ID
        : process.env.CARD_INTEGRATION_ID;

    const paymentKeyResponse = await axios.post(
      `${PAYMOB_BASE_URL}/acceptance/payment_keys`,
      {
        auth_token: authToken,
        amount_cents: amountCents,
        expiration: 3600,
        order_id: paymobOrderResponse.data.id,
        currency: "EGP",
        integration_id: integrationId,
        billing_data: {
          ...DEFAULT_BILLING,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          phone_number: user.phone,
        },
      },
    );
    const paymentToken = paymentKeyResponse.data.token;

    // ── 13. Wallet payment ──────────────────────────────────────────────────
    if (paymentMethod === "wallet") {
      const walletResponse = await axios.post(
        `${PAYMOB_BASE_URL}/acceptance/payments/pay`,
        {
          source: { identifier: phone, subtype: "WALLET" },
          payment_token: paymentToken,
        },
      );
      return res.status(200).json({
        success: true,
        redirectUrl: walletResponse.data.redirect_url,
      });
    }

    // ── 14. Card payment ────────────────────────────────────────────────────
    const paymentUrl = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentToken}`;

    return res.status(200).json({
      success: true,
      paymentUrl,
    });
  } catch (error) {
    // لو الـ order جديد ومعندوش transactionId بعد => نعمله failed
    if (order?._id && !order.transactionId) {
      await orderModel
        .findByIdAndUpdate(order._id, { status: "failed" })
        .catch((err) => console.error("Order cleanup failed:", err));
    }

    console.error("createPayment error:", {
      message: error.message,
      paymobStatus: error.response?.status,
      paymobData: error.response?.data,
    });

    return res.status(500).json({
      success: false,
      message: "Payment processing failed. Please try again.",
      ...(process.env.NODE_ENV === "development" && {
        debug: error.message,
      }),
    });
  }
};

module.exports = createPayment;
