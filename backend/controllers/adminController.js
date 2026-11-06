const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Contact = require("../models/Contact");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const escapeRegex = require("../utils/escapeRegex");

const ROLES = ["JobSeeker", "Employer", "Admin"];

// Admins cannot act on themselves or on other Admins
const assertManageable = (target, admin) => {
  if (target._id.equals(admin._id)) throw new AppError("You cannot perform this action on your own account", 400);
  if (target.role === "Admin") throw new AppError("Admin accounts cannot be modified here", 403);
};

// @route  GET /api/admin/stats
const getAdminStats = asyncHandler(async (req, res) => {
  const [
    totalUsers, totalEmployers, totalJobSeekers,
    totalJobs, openJobs, totalApplications, unreadMessages,
    recentUsers, recentJobs, recentApplications,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "Employer" }),
    User.countDocuments({ role: "JobSeeker" }),
    Job.countDocuments(),
    Job.countDocuments({ status: "Open" }),
    Application.countDocuments(),
    Contact.countDocuments({ status: "Unread" }),
    User.find().sort({ createdAt: -1 }).limit(5).select("name email role createdAt"),
    Job.find().sort({ createdAt: -1 }).limit(5)
      .select("title status createdAt employerId")
      .populate("employerId", "name companyName"),
    Application.find().sort({ appliedAt: -1 }).limit(5)
      .select("status matchScore appliedAt jobId applicantId")
      .populate("applicantId", "name")
      .populate("jobId", "title"),
  ]);

  res.status(200).json({
    success: true,
    stats: { totalUsers, totalEmployers, totalJobSeekers, totalJobs, openJobs, totalApplications, unreadMessages },
    recent: { users: recentUsers, jobs: recentJobs, applications: recentApplications },
  });
});

// @route  GET /api/admin/users   Query: role, search, page, limit
const getUsers = asyncHandler(async (req, res) => {
  const { role, search } = req.query;
  const filter = {};

  if (typeof role === "string" && ROLES.includes(role)) filter.role = role;
  if (typeof search === "string" && search.trim()) {
    const pattern = { $regex: escapeRegex(search.trim()), $options: "i" };
    filter.$or = [{ name: pattern }, { email: pattern }];
  }

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: users.length,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    users,
  });
});

// @route  PATCH /api/admin/users/:id/status   Body: { isActive: true|false }
const setUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError("User not found", 404);
  assertManageable(user, req.user);

  user.isActive = req.body.isActive;
  await user.save();
  res.status(200).json({ success: true, user });
});

// @route  DELETE /api/admin/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError("User not found", 404);
  assertManageable(user, req.user);

  if (user.role === "Employer") {
    const jobIds = await Job.find({ employerId: user._id }).distinct("_id");
    await Application.deleteMany({ jobId: { $in: jobIds } });
    await Job.deleteMany({ employerId: user._id });
  } else if (user.role === "JobSeeker") {
    await Application.deleteMany({ applicantId: user._id });
  }

  await user.deleteOne();
  res.status(200).json({ success: true, message: "User and related data deleted" });
});

module.exports = { getAdminStats, getUsers, setUserStatus, deleteUser };
