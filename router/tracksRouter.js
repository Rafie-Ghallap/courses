const express = require("express");
const router = express.Router();

const {createTrack} = require("../controllers/tracks/createTrack ");
const {getTrackCourses} = require("../controllers/tracks/getTrackCourses");
const {getAllTracks} = require("../controllers/tracks/getAllTracks");
const { updateTrack } = require("../controllers/tracks/updateTrack");
const { deleteTrack } = require("../controllers/tracks/deleteTracke");
const { checkAuth } = require("../middleware/checkAuth");
const { checkRole } = require("../middleware/checkRole");

router.use(checkAuth);

router.get("/all", getAllTracks);
router.get("/:id/courses", getTrackCourses);

router.use(checkRole(["admin"]));
router.post("/createTrack", createTrack);
router.put("/update/:id", updateTrack);
router.delete("/delete/:id", deleteTrack);

module.exports = router;
