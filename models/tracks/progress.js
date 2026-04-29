const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    enrolledTracks: [
      {
        trackId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "tracks",
          // default: new mongoose.Types.ObjectId("68de6b2c00de3ea063601fa0"),
        },
        level: { type: String, default: "Beginner" },
        openedCourses: [
          {
            courseId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "courses",
              // default: new mongoose.Types.ObjectId("68de690acb4ba99ed5c196c8"),
            },
            openedLessons: [
              {
                lessonId: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "lessons",
                  // default: new mongoose.Types.ObjectId("68de9134d5b264f2a77a4266"),
                },
                completedExercises: [
                  {
                    exerciseId: {
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "exercises",
                    },
                    score: String,
                  },
                ],
              },
            ],
            //finalExamPassed:boolean,
            xpEarned: { type: Number, default: 0 },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const progressData = mongoose.model("Progress", ProgressSchema);
module.exports = { progressData };
