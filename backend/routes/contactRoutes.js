const express = require("express");
const {
  createContact, getContacts, updateContactStatus,
} = require("../controllers/contactController");
const { protect, authorize } = require("../middleware/auth");
const { validate } = require("../validators/authValidator");
const { contactRules, contactStatusRules } = require("../validators/contactValidator");

const router = express.Router();

router.post("/", contactRules, validate, createContact);
router.get("/", protect, authorize("Admin"), getContacts);
router.patch("/:id/status", protect, authorize("Admin"), contactStatusRules, validate, updateContactStatus);

module.exports = router;
