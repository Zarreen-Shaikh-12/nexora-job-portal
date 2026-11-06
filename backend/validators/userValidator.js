const { body, param } = require("express-validator");

const urlOptions = { protocols: ["http", "https"], require_protocol: true };

const updateProfileRules = [
  body("name").optional().trim().isLength({ min: 2, max: 60 }).withMessage("Name must be 2-60 characters"),
  body("phone")
    .optional({ values: "falsy" })
    .matches(/^[0-9+\-\s]{7,15}$/)
    .withMessage("Please provide a valid phone number"),
  body("bio").optional().trim().isLength({ max: 500 }).withMessage("Bio cannot exceed 500 characters"),
  body("skills").optional().isArray({ max: 50 }).withMessage("Skills must be an array of at most 50 items"),
  body("skills.*").isString().trim().notEmpty().isLength({ max: 50 }).withMessage("Each skill must be 1-50 characters"),
  body("resumeUrl").optional({ values: "falsy" }).isURL(urlOptions).withMessage("Resume URL must be a valid http or https link"),
  body("companyName").optional().trim().isLength({ max: 100 }).withMessage("Company name is too long"),
  body("companyWebsite").optional({ values: "falsy" }).isURL(urlOptions).withMessage("Website must be a valid http or https link"),
  body("companyDescription").optional().trim().isLength({ max: 1000 }).withMessage("Description is too long"),
];

const userIdRules = [param("id").isMongoId().withMessage("Invalid user id")];

const userStatusRules = [
  ...userIdRules,
  body("isActive").isBoolean({ strict: true }).withMessage("isActive must be true or false"),
];

module.exports = { updateProfileRules, userIdRules, userStatusRules };
