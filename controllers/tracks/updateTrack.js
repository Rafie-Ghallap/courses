const { tracksModel } = require('../../models/tracks/tracks');

const updateTrack = async (req, res) => {
  try {
    const { name } = req.body;

    const track = await tracksModel.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }

    res.status(200).json(track);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { updateTrack };

