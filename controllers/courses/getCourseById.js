const { coursesModel } = require("../../models/tracks/courses");

const getCourseById = async (req, res) => {
    try { const courseId=req.params.id;
    if(!courseId){
        return res.status(400).json({message:"you must provide the course id"});
    }

    let course=await coursesModel.findById(courseId);
    if(!course){
        return res.status(404).json({message:"course not found"});
    }

    res.status(200).json({course});
    } catch (err) {
        console.error("Error fetching course:", err.message);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

module.exports = getCourseById;
