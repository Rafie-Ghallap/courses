const { string } = require('joi');
const mongoose=require('mongoose');

const lessonSchema=new mongoose.Schema(
{

title: String, 

content: String,

duration: Number,

videoUrl:{author:{type: String ,default: "Unknown"}, url:{type: String}},

courseId:{type:mongoose.Schema.Types.ObjectId, ref:"courses"},

order: Number, 

});

lessonSchema.index({ courseId: 1, title: 1 }, { unique: true });

const lessonsModel=mongoose.model('lessons', lessonSchema);
module.exports={lessonsModel}