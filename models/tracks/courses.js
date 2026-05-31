const { req } = require("agent-base");
const mongoose = require("mongoose");
const { th } = require("zod/v4/locales");

const courseSchema = new mongoose.Schema({

  course_name: { type: String, required: true },

  track_name: String,


  description: { type: String, maxlength: 500 },

  thumbnail: String,

  duration: Number,

  lessonCount: { type: Number, default: 0 },

  isPaid: {
    type: Boolean,
    default: false,
  },

  price: { type: Number, required: true },

  language: { type: String, default: "English" },

  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },

  ratingAverage: { type: Number, default: 0 },

  studentsCount: { type: Number, default: 0 },

  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },

  courseStatus: { type: String, enum: ["draft","pending", "published","rejected"], default: "draft" },
  createdAt: { type: Date, default: Date.now },

});

courseSchema.index({ course_name: 1, instructorId: 1 }, { unique: true });
const coursesModel = mongoose.model("courses", courseSchema);
module.exports = { coursesModel };