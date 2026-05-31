const axios = require("axios");

const PAYMOB_BASE_URL = "https://accept.paymob.com/api";

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

const getAuthToken = async () => {
  const response = await axios.post(`${PAYMOB_BASE_URL}/auth/tokens`, {
    api_key: process.env.PAYMOB_API_KEY,
  });
  return response.data.token;
};

const createPaymobOrder = async (authToken, amountCents) => {
  const response = await axios.post(
    `${PAYMOB_BASE_URL}/ecommerce/orders`,
    {
      auth_token: authToken,
      delivery_needed: false,
      amount_cents: amountCents,
      currency: "EGP",
      items: [],
    },
  );
  return response.data;
};

const getPaymentKey = async ({
  authToken,
  amountCents,
  paymobOrderId,
  integrationId,
  user,
  phone,
}) => {
  const response = await axios.post(
    `${PAYMOB_BASE_URL}/acceptance/payment_keys`,
    {
      auth_token: authToken,
      amount_cents: amountCents,
      expiration: 3600,
      order_id: paymobOrderId,
      currency: "EGP",
      integration_id: integrationId,
      billing_data: {
        ...DEFAULT_BILLING,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        phone_number: phone,
      },
    },
  );
  return response.data.token;
};

const initiateWalletPayment = async (phone, paymentToken) => {
  const response = await axios.post(
    `${PAYMOB_BASE_URL}/acceptance/payments/pay`,
    {
      source: {
        identifier: phone,
        subtype: "WALLET",
      },
      payment_token: paymentToken,
    },
  );
  return response.data;
};

module.exports = {
  getAuthToken,
  createPaymobOrder,
  getPaymentKey,
  initiateWalletPayment,
};
