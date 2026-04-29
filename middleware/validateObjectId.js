const mongoose = require("mongoose");

function validateObjectIdParam(req, res, next) {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(400).json({ error: "Invalid ObjectId" });
	}
	next();
}

module.exports = { validateObjectIdParam };