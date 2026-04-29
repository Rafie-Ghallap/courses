const { lessonsModel } = require("../../models/tracks/lessons");

const getLessons = async (req, res) => {
  try {
    const courseId=req.params.courseId;
    const lessons=await lessonsModel.find({ courseId },"title content duration order").sort({ order: 1 });
    

    if(!lessons.length){
        return res.json({message:"no lessons found!"});
    }

    res.json({lessons});
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ message: "internal server error", error: err.message });
  }
};
module.exports = getLessons;
