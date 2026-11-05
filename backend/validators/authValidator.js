const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg, // first error, readable in a toast
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const registerRules = [
  body("name").trim().isLength({ min: 2, max: 60 }).withMessage("Name must be 2-60 characters"),
  body("email").trim().isEmail().withMessage("Please provide a valid email").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn(["JobSeeker", "Employer"])
    .withMessage("Role must be JobSeeker or Employer"), // Admin is rejected here
  body("phone")
    .optional({ values: "falsy" })
    .matches(/^[0-9+\-\s]{7,15}$/)
    .withMessage("Please provide a valid phone number"),
  body("skills").optional().isArray().withMessage("Skills must be an array of strings"),
  body("companyName").optional().trim().isLength({ max: 100 }).withMessage("Company name is too long"),
];

const loginRules = [
  body("email").trim().isEmail().withMessage("Please provide a valid email").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

module.exports = { validate, registerRules, loginRules };
