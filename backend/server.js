require("dotenv").config(); // must run first so process.env is populated

const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

connectDB();

const app = express();

// On Render/Heroku the app sits behind a proxy; needed for secure cookies in production
if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);

// ---------- Global middleware ----------
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// ---------- Routes ----------
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Job Portal API is running" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
// (applications and contact routes will be mounted here in later steps)

// ---------- Error handling (must be LAST) ----------
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
