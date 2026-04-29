
const { tracksModel } = require("../../models/tracks/tracks");
const createTrack = async (req, res) => {
  try {
    const { name } = req.body;

    const existingTrack = await tracksModel.findOne({ name });
    if (existingTrack) {
      return res.status(400).json({ message: "Track already exists" });
    }

    const track = await tracksModel.create({
      name
    });

    res.status(201).json(track);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
module.exports = { createTrack };