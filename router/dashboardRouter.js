const express = require("express");
const router = express.Router();

const { getAdminDashboard } = require("../controllers/dashboard/adminDashboard/adminDashboard");
const { rejectInstructor } = require("../controllers/dashboard/adminDashboard/rejectInstructor");
const { approveInstructor } = require("../controllers/dashboard/adminDashboard/approveInstructor");
const { requestInstructor } = require("../controllers/dashboard/adminDashboard/getInstructorRequests");
const {getInstructorDashboard} = require("../controllers/dashboard/instructorDashboard")
const {getStudentDashboard} = require("../controllers/dashboard/studentDashboard")
const { checkAuth } = require("../middleware/checkAuth");
const { checkRole } = require("../middleware/checkRole");

router.use(checkAuth);

router.get("/instructor", checkRole(["instructor"]), getInstructorDashboard);
router.get("/student", checkRole(["student"]), getStudentDashboard);
router.post("/admin/request-instructor", requestInstructor);

router.use(checkRole(["admin"]));
router.get("/admin", getAdminDashboard);
router.put("/admin/reject-instructor/:id", rejectInstructor);
router.put("/admin/approve-instructor/:id", approveInstructor);

module.exports = router;