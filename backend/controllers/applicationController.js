const Application = require("../models/Application");
const Job = require("../models/Job");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { calculateMatchScore } = require("../utils/matchScore");

// Owner Employer or Admin only (job.employerId must not be populated here)
const assertJobAccess = (job, user) => {
  if (!job.employerId.equals(user._id) && user.role !== "Admin") {
    throw new AppError("You are not allowed to access applications for this job", 403);
  }
};

const SORT_OPTIONS = {
  score: { matchScore: -1, appliedAt: 1 }, // best match first; earlier applicant wins ties
  newest: { appliedAt: -1 },
  oldest: { appliedAt: 1 },
};

// @route  POST /api/applications/apply   (JobSeeker)
const applyForJob = asyncHandler(async (req, res) => {
  const { jobId, resumeUrl } = req.body;

  const job = await Job.findById(jobId);
  if (!job) throw new AppError("Job not found", 404);
  if (job.status !== "Open") throw new AppError("This job is no longer accepting applications", 400);

  // Friendly pre-check. The unique index still protects against simultaneous requests.
  const existing = await Application.findOne({ jobId, applicantId: req.user._id });
  if (existing) throw new AppError("You have already applied to this job", 409);

  // Calculate and store the score as a snapshot at apply time
  const { score, matchedSkills, missingSkills } = calculateMatchScore(
    job.requirements,
    req.user.skills
  );

  const application = await Application.create({
    jobId,
    applicantId: req.user._id, // always the logged-in user, never from the body
    resumeUrl: resumeUrl || req.user.resumeUrl || "",
    matchScore: score,
    matchedSkills,
    missingSkills,
  });

  res.status(201).json({ success: true, application });
});

// @route  GET /api/applications/my-applications   (JobSeeker)
const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ applicantId: req.user._id })
    .sort({ appliedAt: -1 })
    .populate({
      path: "jobId",
      select: "title location jobType status employerId",
      populate: { path: "employerId", select: "name companyName" },
    });

  res.status(200).json({ success: true, count: applications.length, applications });
});

// @route  GET /api/applications/job/:jobId   (owner Employer or Admin)
// Query: sort (score|newest|oldest), status
const getJobApplications = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) throw new AppError("Job not found", 404);
  assertJobAccess(job, req.user);

  const filter = { jobId: job._id };
  const { status, sort } = req.query;
  if (typeof status === "string" && ["Applied", "Shortlisted", "Rejected"].includes(status)) {
    filter.status = status;
  }
  const sortKey = typeof sort === "string" && Object.hasOwn(SORT_OPTIONS, sort) ? sort : "score";

  const applications = await Application.find(filter)
    .sort(SORT_OPTIONS[sortKey])
    .populate("applicantId", "name email phone skills bio avatar resumeUrl");

  res.status(200).json({
    success: true,
    count: applications.length,
    job: { id: job._id, title: job.title, requirements: job.requirements },
    applications,
  });
});

// @route  PATCH /api/applications/:id/status   (owner Employer or Admin)
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) throw new AppError("Application not found", 404);

  // Ownership is decided by the JOB's employer, not by anything in the request
  const job = await Job.findById(application.jobId);
  if (!job) throw new AppError("The job for this application no longer exists", 404);
  assertJobAccess(job, req.user);

  application.status = req.body.status;
  await application.save();

  res.status(200).json({ success: true, application });
});

module.exports = { applyForJob, getMyApplications, getJobApplications, updateApplicationStatus };
