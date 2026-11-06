const express = require("express");
const {
  getJobs, getMyJobs, getJob, createJob, updateJob, deleteJob,
} = require("../controllers/jobController");
const { protect, authorize } = require("../middleware/auth");
const { validate } = require("../validators/authValidator");
const { createJobRules, updateJobRules } = require("../validators/jobValidator");

const router = express.Router();

router.get("/", getJobs);
router.get("/my-jobs", protect, authorize("Employer"), getMyJobs); // must be before "/:id"
router.get("/:id", getJob);
router.post("/", protect, authorize("Employer"), createJobRules, validate, createJob);
router.put("/:id", protect, authorize("Employer", "Admin"), updateJobRules, validate, updateJob);
router.delete("/:id", protect, authorize("Employer", "Admin"), deleteJob);

module.exports = router;
