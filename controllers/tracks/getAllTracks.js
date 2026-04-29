const { tracksModel } = require('../../models/tracks/tracks');

const getAllTracks = async (req, res) => {
  try {
    const tracks = await Track.find({},"name");

    res.status(200).json(tracks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = { getAllTracks };