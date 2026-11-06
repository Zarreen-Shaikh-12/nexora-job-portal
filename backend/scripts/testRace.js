const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
require("dotenv").config();
const mongoose = require("mongoose");
const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Application.init();

  const job = await Job.findOne({ status: "Open" });
  const seeker = await User.findOne({ email: "divya@demo.com" });
  await Application.deleteMany({ jobId: job._id, applicantId: seeker._id });

  const results = await Promise.allSettled(
    Array.from({ length: 5 }, () => Application.create({ jobId: job._id, applicantId: seeker._id }))
  );

  const ok = results.filter((r) => r.status === "fulfilled").length;
  const dup = results.filter((r) => r.status === "rejected" && r.reason.code === 11000).length;
  console.log(`Succeeded: ${ok} (expect 1) | Blocked by unique index: ${dup} (expect 4)`);

  await Application.deleteMany({ jobId: job._id, applicantId: seeker._id });
  await mongoose.disconnect();
})();
