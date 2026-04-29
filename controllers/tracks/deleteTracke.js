const { tracksModel } = require('../../models/tracks/tracks');

const deleteTrack = async (req, res) => {
  try {
    const track = await tracksModel.findByIdAndDelete(req.params.id);

    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }

    res.status(200).json({ message: "Track deleted successfully" });
  } catch (err) {
    res.status(500).json({ message:"Server Error", error: err.message });
  }
};
module.exports = { deleteTrack };