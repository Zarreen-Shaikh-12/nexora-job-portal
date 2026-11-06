const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const asyncHandler = require("../utils/asyncHandler");

// @route  GET /api/stats   (public, counts only)
const getPublicStats = asyncHandler(async (req, res) => {
  const [openJobs, employers, jobSeekers, applications] = await Promise.all([
    Job.countDocuments({ status: "Open" }),
    User.countDocuments({ role: "Employer", isActive: true }),
    User.countDocuments({ role: "JobSeeker", isActive: true }),
    Application.countDocuments(),
  ]);

  res.status(200).json({ success: true, stats: { openJobs, employers, jobSeekers, applications } });
});

module.exports = { getPublicStats };
