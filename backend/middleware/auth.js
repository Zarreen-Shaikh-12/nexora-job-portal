const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

// Authentication: who is making this request?
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token; // preferred: HTTP-only cookie
  } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1]; // fallback: Postman / non-browser clients
  }

  if (!token) throw new AppError("Not authenticated. Please log in.", 401);

  // Throws JsonWebTokenError / TokenExpiredError if invalid; the error handler converts those to 401
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user) throw new AppError("The account for this token no longer exists.", 401);
  if (!user.isActive) throw new AppError("This account has been deactivated.", 403);

  req.user = user;
  next();
});

// Authorization: is this user's role allowed? Usage: authorize("Employer", "Admin")
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError(`Role '${req.user ? req.user.role : "unknown"}' is not allowed to access this resource.`, 403));
  }
  next();
};

module.exports = { protect, authorize };
