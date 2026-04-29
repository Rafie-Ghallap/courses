const { coursesModel } = require("../../models/tracks/courses");

const getCourses = async (req, res) => {
  try {
    const courses=await coursesModel.find({},"title description price thumbnail ratingAverage studentsCount").sort({ createdAt: -1 });

    if(!courses.length){
        return res.json({message:"no courses found!"});
    }
    res.status(200).json({courses});
  } catch (err) {
    console.error("Error fetching courses:", err.message);
    res
      .status(500)
      .json({ message: "internal server error", error: err.message });
  }
};
module.exports = getCourses;
