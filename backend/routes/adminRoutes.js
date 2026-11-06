const express = require("express");
const { getAdminStats, getUsers, setUserStatus, deleteUser } = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");
const { validate } = require("../validators/authValidator");
const { userIdRules, userStatusRules } = require("../validators/userValidator");

const router = express.Router();

// Every route below requires a logged-in Admin
router.use(protect, authorize("Admin"));

router.get("/stats", getAdminStats);
router.get("/users", getUsers);
router.patch("/users/:id/status", userStatusRules, validate, setUserStatus);
router.delete("/users/:id", userIdRules, validate, deleteUser);

module.exports = router;
