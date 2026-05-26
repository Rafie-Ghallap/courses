const { lessonsModel } = require("../../models/tracks/lessons");
const { coursesModel } = require("../../models/tracks/courses");

const addLesson = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    console.log("Course ID:", courseId);
    const { title, content, videoUrl, order } = req.body;

    if (!title || !videoUrl || !videoUrl.url || !order) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    const existingLesson = await lessonsModel.findOne({ courseId, title });

    if (existingLesson) {
      return res.status(400).json({
        message: "Lesson title already exists.",
      });
    }
    const existigvideoUrl = await lessonsModel.findOne({
      courseId,
      "videoUrl.url": videoUrl.url,
    });

    if (existigvideoUrl) {
      return res.status(400).json({
        message: "Video already exists.",
      });
    }

    const newLesson = new lessonsModel({
      title,
      content,
      videoUrl,
      courseId: courseId,
      order,
    });

    const updatedCourse = await coursesModel.findByIdAndUpdate(
      courseId,
      {
        $inc: { lessonCount: 1 },
      },
      { new: true },
    );

    if (!updatedCourse) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    const savedLesson = await newLesson.save();

    res.status(201).json({
      message: "Lesson created successfully!",
      data: savedLesson,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = addLesson;
