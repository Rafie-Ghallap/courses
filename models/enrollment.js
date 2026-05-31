const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
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
  progress: {
    type: Number,
    default: 0,
  },
});


enrollmentSchema.index({ student_id: 1, course_id: 1 }, { unique: true });

const enrollmentModel =
  mongoose.models.Enrollment ||
  mongoose.model("Enrollment", enrollmentSchema);
module.exports = { enrollmentModel };