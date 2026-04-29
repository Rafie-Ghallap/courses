const express = require("express");
const router = express.Router();

const {enrollCourse} = require("../controllers/enrollment/enrollCourse");
const { getMyEnrollments } = require("../controllers/enrollment/getMyEnrollments");
const { unenrollCourse } = require("../controllers/enrollment/unenrollCourse");
const {checkAuth} = require("../middleware/checkAuth");
const {checkRole} = require("../middleware/checkRole");

router.use(checkAuth);
router.use(checkRole(["student"]));

router.post("/enroll/:id", enrollCourse);
router.get("/myEnrollments", getMyEnrollments);
router.delete("/unenroll/:id", unenrollCourse);

module.exports = router;