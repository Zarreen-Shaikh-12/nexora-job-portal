const asyncHandler = require("../utils/asyncHandler");
const { normalizeList } = require("../utils/matchScore");

// Fields each role may edit (email and role are never editable here)
const COMMON_FIELDS = ["name", "phone", "bio"];
const ROLE_FIELDS = {
  JobSeeker: ["skills", "resumeUrl"],
  Employer: ["companyName", "companyWebsite", "companyDescription"],
  Admin: [],
};

// @route  PUT /api/users/profile   (any logged-in user)
const updateProfile = asyncHandler(async (req, res) => {
  const user = req.user; // already loaded by protect (password is not selected)
  const allowed = [...COMMON_FIELDS, ...ROLE_FIELDS[user.role]];

  allowed.forEach((key) => {
    if (req.body[key] !== undefined) user[key] = req.body[key];
  });
  if (req.body.skills !== undefined && user.role === "JobSeeker") {
    user.skills = normalizeList(req.body.skills);
  }

  await user.save();
  res.status(200).json({ success: true, user });
});

module.exports = { updateProfile };
