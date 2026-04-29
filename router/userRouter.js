const express = require("express");
const router = express.Router();

const { getAllUsers } = require("../controllers/user/GetAllUsers");
const { getUserById } = require("../controllers/user/getUserById");
const { deleteUser } = require("../controllers/user/deleteUser");
const { checkAuth } = require("../middleware/checkAuth");
const { checkRole } = require("../middleware/checkRole");

router.use(checkAuth);
router.use(checkRole(["admin"]));
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);

module.exports = router;
