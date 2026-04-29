const mongoose = require("mongoose");
const validator = require("validator");

const options = {
  timestamps: true,
  versionKey: false,
};

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 50,
      validate: {
        validator: (v) => /^[a-z0-9._%+-]{3,}@[a-z0-9.-]+\.[a-z]{2,}$/.test(v),
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 60,
      maxlength: 200,
      select: false, //excluded by default when querying, for security.
    },
    firstName: { type: String, minlength: 2, maxlength: 50 },
    lastName: { type: String, minlength: 2, maxlength: 50 },
    phone: {
      type: String,
      validate: {
        // validator: (v) => validator.isMobilePhone(v, "any"),
        validator: (v) => /^01[0-2,5]{1}[0-9]{8}$/.test(v),
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },

    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },

    about: {
      type: String,
      maxlength: 500,
    },

    address: {
      city: String,
      country: { type: String },
    },

    instructorStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },

    isEmailVerified: { type: Boolean, default: false },
    otpEnabled: { type: Boolean, default: false },
  },
  options,
);

const usersModel = mongoose.model("users", userSchema);
module.exports = { usersModel };
