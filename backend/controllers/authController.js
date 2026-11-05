const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { sendTokenResponse, cookieOptions } = require("../utils/sendTokenResponse");

// @route  POST /api/auth/register   (public)
const register = asyncHandler(async (req, res) => {
  // Pick fields explicitly (never User.create(req.body)): blocks mass assignment
  const { name, email, password, role, phone, skills, companyName } = req.body;

  const userData = { name, email, password, phone };
  userData.role = role === "Employer" ? "Employer" : "JobSeeker"; // Admin impossible here

  if (userData.role === "JobSeeker" && Array.isArray(skills)) userData.skills = skills;
  if (userData.role === "Employer" && companyName) userData.companyName = companyName;

  // Duplicate email -> Mongo error 11000 -> errorHandler returns 409
  const user = await User.create(userData);
  sendTokenResponse(user, 201, res);
});

// @route  POST /api/auth/login   (public)
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // password has select:false, so we must request it explicitly
  const user = await User.findOne({ email }).select("+password");

  // Same message for "no such email" and "wrong password"
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }
  if (!user.isActive) throw new AppError("This account has been deactivated.", 403);

  sendTokenResponse(user, 200, res);
});

// @route  GET /api/auth/me   (protected)
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

// @route  POST /api/auth/logout   (public)
const logout = asyncHandler(async (req, res) => {
  const { maxAge, ...options } = cookieOptions(); // same flags, no maxAge
  res.clearCookie("token", options);
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

module.exports = { register, login, getMe, logout };
