const Job = require("../models/Job");
const Application = require("../models/Application");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const escapeRegex = require("../utils/escapeRegex");

const JOB_TYPES = ["Full-time", "Part-time", "Remote"];

// Whitelist of sort options (never pass raw user input to .sort())
const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  "salary-high": { "salaryRange.max": -1 },
  "salary-low": { "salaryRange.min": 1 },
};

// Owner or Admin only. Note: job.employerId must NOT be populated here,
// otherwise it becomes a document and .equals() would compare the wrong thing.
const assertCanModify = (job, user) => {
  const isOwner = job.employerId.equals(user._id);
  if (!isOwner && user.role !== "Admin") {
    throw new AppError("You are not allowed to modify this job", 403);
  }
};

// @route  GET /api/jobs   (public)
// Query: search, location, jobType, status (Open|Closed|all), sort, page, limit
const getJobs = asyncHandler(async (req, res) => {
  const { search, location, jobType, status, sort } = req.query;
  const filter = {};

  if (typeof search === "string" && search.trim()) {
    filter.title = { $regex: escapeRegex(search.trim()), $options: "i" };
  }
  if (typeof location === "string" && location.trim()) {
    filter.location = { $regex: escapeRegex(location.trim()), $options: "i" };
  }
  if (typeof jobType === "string" && JOB_TYPES.includes(jobType)) {
    filter.jobType = jobType;
  }
  // Public default: only Open jobs. "all" removes the status filter.
  if (status !== "all") {
    filter.status = status === "Closed" ? "Closed" : "Open";
  }

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
  const sortKey = typeof sort === "string" && Object.hasOwn(SORT_OPTIONS, sort) ? sort : "newest";
  // _id as a tie-breaker keeps pagination stable when sort values are equal
  const sortBy = { ...SORT_OPTIONS[sortKey], _id: -1 };

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("employerId", "name companyName"),
    Job.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: jobs.length,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    jobs,
  });
});

// @route  GET /api/jobs/my-jobs   (Employer)
const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ employerId: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: jobs.length, jobs });
});

// @route  GET /api/jobs/:id   (public)
const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate(
    "employerId",
    "name companyName companyWebsite companyDescription"
  );
  if (!job) throw new AppError("Job not found", 404);
  res.status(200).json({ success: true, job });
});

// @route  POST /api/jobs   (Employer)
const createJob = asyncHandler(async (req, res) => {
  const { title, description, requirements, location, salaryRange, jobType } = req.body;

  const job = await Job.create({
    title,
    description,
    requirements,
    location,
    salaryRange,
    jobType,
    employerId: req.user._id, // always the logged-in user, never from the body
  });

  res.status(201).json({ success: true, job });
});

// @route  PUT /api/jobs/:id   (Owner Employer or Admin)
const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new AppError("Job not found", 404);
  assertCanModify(job, req.user);

  const allowed = ["title", "description", "requirements", "location", "jobType", "status"];
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) job[key] = req.body[key];
  });

  // Merge partial salary updates with the existing values
  if (req.body.salaryRange) {
    job.salaryRange = {
      min: req.body.salaryRange.min ?? job.salaryRange.min,
      max: req.body.salaryRange.max ?? job.salaryRange.max,
    };
  }

  await job.save(); // runs schema validators, including the salary check
  res.status(200).json({ success: true, job });
});

// @route  DELETE /api/jobs/:id   (Owner Employer or Admin)
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new AppError("Job not found", 404);
  assertCanModify(job, req.user);

  // Remove this job's applications too, so no orphan records remain
  await Application.deleteMany({ jobId: job._id });
  await job.deleteOne();

  res.status(200).json({ success: true, message: "Job and its applications deleted" });
});

module.exports = { getJobs, getMyJobs, getJob, createJob, updateJob, deleteJob };
