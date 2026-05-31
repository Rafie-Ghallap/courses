const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["card", "wallet"],
      required: true,
    },

    transactionId: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);


const orderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);

module.exports = {
  orderModel
};