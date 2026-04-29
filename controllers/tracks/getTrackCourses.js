const { tracksModel }=require("../../models/tracks/tracks")
const { coursesModel }=require("../../models/tracks/courses")

const getTrackCourses = async (req, res) => {
  try {
    const trackId  = req.params.id;

    const courses = await coursesModel.find({
      trackId: trackId
    });

    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports={getTrackCourses}