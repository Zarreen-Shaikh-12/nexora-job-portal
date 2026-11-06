const { body, param } = require("express-validator");

const contactRules = [
  body("name").trim().isLength({ min: 2, max: 60 }).withMessage("Name must be 2-60 characters"),
  body("email").trim().isEmail().withMessage("Please provide a valid email"),
  body("message")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Message must be 10-1000 characters"),
];

const contactStatusRules = [
  param("id").isMongoId().withMessage("Invalid message id"),
  body("status").isIn(["Unread", "Replied"]).withMessage("Status must be Unread or Replied"),
];

module.exports = { contactRules, contactStatusRules };
