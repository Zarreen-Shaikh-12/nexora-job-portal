const jwt = require("jsonwebtoken");

const isProd = () => process.env.NODE_ENV === "production";

// Shared by sendTokenResponse and logout. Cookie settings must match to clear it.
const cookieOptions = () => ({
  httpOnly: true,                       // JavaScript cannot read this cookie (blocks XSS theft)
  secure: isProd(),                     // HTTPS only in production
  sameSite: isProd() ? "none" : "lax",  // "none" needed when frontend and backend are on different domains
  maxAge: Number(process.env.JWT_COOKIE_DAYS || 7) * 24 * 60 * 60 * 1000,
});

const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  const body = {
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };

  // Development only: lets you test Bearer auth in Postman.
  if (!isProd()) body.token = token;

  res.status(statusCode).cookie("token", token, cookieOptions()).json(body);
};

module.exports = { sendTokenResponse, cookieOptions };
