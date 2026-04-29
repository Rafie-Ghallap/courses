const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  courses: [{ type: mongoose.Schema.ObjectId, ref: "courses" }],
});

const tracksModel = mongoose.model("tracks", trackSchema);
module.exports = { tracksModel };
