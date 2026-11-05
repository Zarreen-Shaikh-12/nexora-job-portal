require("dotenv").config(); // must run first so process.env is populated

const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

connectDB();

const app = express();

// ---------- Global middleware ----------
app.use(helmet());                       // secure headers
app.use(morgan("dev"));                  // request logging
app.use(express.json());                 // parse JSON request bodies
app.use(cookieParser());                 // parse cookies
app.use(
  cors({
    origin: process.env.CLIENT_URL,      // only our React app may call us
    credentials: true,                   // allow cookies cross-origin
  })
);

// ---------- Routes ----------
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Job Portal API is running" });
});

// (feature routes will be mounted here in later steps)

// ---------- 404 handler ----------
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
