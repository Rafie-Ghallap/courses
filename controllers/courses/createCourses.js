const { coursesModel } = require("../../models/tracks/courses");


const createCourses = async (req, res) => {
  try {
    const {
      course_name,
      track_name,
      description,
      duration,
      thumbnail,
      language,
      level,
      price,
    } = req.body;

    if (!course_name || !track_name || !description  || !price || !duration) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }
    const instructorId = req.user.id;
    if (!instructorId) {
      return res.status(400).json({
        message: "Instructor ID is required"
      });
    }
    const existingCourse = await coursesModel.findOne({
      course_name,
      instructorId
    });

    if (existingCourse) {
      return res.status(409).json({
        message: "Course already exists for this instructor"
      });
    }


    const newCourse = new coursesModel({
      course_name,
      track_name,
      description,
      duration,
      price,
      instructorId
    });

    await newCourse.save();

    res.json({ message: "Course added successfully" });
  } catch (err) {
    console.error("Error adding course:", err.message);
    res
      .status(500)
      .json({ message: "internal server error"});
  }
};
module.exports = createCourses;
