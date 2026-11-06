const { body, param } = require("express-validator");

const applyRules = [
  body("jobId").isMongoId().withMessage("A valid jobId is required"),
  body("resumeUrl")
    .optional({ values: "falsy" })
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage("Resume URL must be a valid http or https link"),
];

const jobIdParamRules = [param("jobId").isMongoId().withMessage("Invalid job id")];

const statusRules = [
  param("id").isMongoId().withMessage("Invalid application id"),
  body("status")
    .isIn(["Applied", "Shortlisted", "Rejected"])
    .withMessage("Status must be Applied, Shortlisted or Rejected"),
];

module.exports = { applyRules, jobIdParamRules, statusRules };
