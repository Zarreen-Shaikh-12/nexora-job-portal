const { body } = require("express-validator");

const field = (name, isCreate) => (isCreate ? body(name) : body(name).optional());

const buildJobRules = (isCreate) => [
  field("title", isCreate)
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be 3-100 characters"),
  field("description", isCreate)
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),
  field("requirements", isCreate)
    .isArray({ min: 1 })
    .withMessage("Requirements must be a non-empty array of skills"),
  body("requirements.*")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Each requirement must be a non-empty text"),
  field("location", isCreate)
    .trim()
    .notEmpty()
    .withMessage("Location is required"),
  field("jobType", isCreate)
    .isIn(["Full-time", "Part-time", "Remote"])
    .withMessage("Job type must be Full-time, Part-time or Remote"),
  body("salaryRange").optional().isObject().withMessage("salaryRange must be an object"),
  body("salaryRange.min").optional().isFloat({ min: 0 }).withMessage("Minimum salary must be 0 or more"),
  body("salaryRange.max").optional().isFloat({ min: 0 }).withMessage("Maximum salary must be 0 or more"),
  body("salaryRange").optional().custom((range) => {
    if (
      range &&
      range.min !== undefined &&
      range.max !== undefined &&
      Number(range.max) < Number(range.min)
    ) {
      throw new Error("Maximum salary must be greater than or equal to minimum salary");
    }
    return true;
  }),
  // status can only be changed through update
  body("status").optional().isIn(["Open", "Closed"]).withMessage("Status must be Open or Closed"),
];

module.exports = {
  createJobRules: buildJobRules(true),
  updateJobRules: buildJobRules(false),
};
