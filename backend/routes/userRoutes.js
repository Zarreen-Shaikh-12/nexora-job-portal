const express = require("express");
const { updateProfile } = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const { validate } = require("../validators/authValidator");
const { updateProfileRules } = require("../validators/userValidator");

const router = express.Router();

router.put("/profile", protect, updateProfileRules, validate, updateProfile);

module.exports = router;
