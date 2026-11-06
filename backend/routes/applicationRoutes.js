const express = require("express");
const {
  applyForJob, getMyApplications, getJobApplications, updateApplicationStatus,
} = require("../controllers/applicationController");
const { protect, authorize } = require("../middleware/auth");
const { validate } = require("../validators/authValidator");
const { applyRules, jobIdParamRules, statusRules } = require("../validators/applicationValidator");

const router = express.Router();

router.post("/apply", protect, authorize("JobSeeker"), applyRules, validate, applyForJob);
router.get("/my-applications", protect, authorize("JobSeeker"), getMyApplications);
router.get("/job/:jobId", protect, authorize("Employer", "Admin"), jobIdParamRules, validate, getJobApplications);
router.patch("/:id/status", protect, authorize("Employer", "Admin"), statusRules, validate, updateApplicationStatus);

module.exports = router;
