require("dotenv").config();

const dns = require("node:dns");
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require("mongoose");
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Contact = require("../models/Contact");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected");

  // Make sure indexes exist BEFORE testing uniqueness
  await Promise.all([User.init(), Job.init(), Application.init(), Contact.init()]);

  const stamp = Date.now();
  const created = {};

  try {
    created.employer = await User.create({
      name: "Test Employer", email: `emp${stamp}@test.com`, password: "secret123",
      role: "Employer", companyName: "Test Co",
    });
    created.seeker = await User.create({
      name: "Test Seeker", email: `seek${stamp}@test.com`, password: "secret123",
      skills: ["  React ", "NODE.JS"],
    });
    console.log("1. Users created. Password hashed?", created.employer.password.startsWith("$2"));
    console.log("   Skills normalized:", created.seeker.skills);

    created.job = await Job.create({
      title: "Test Job", description: "Testing", requirements: ["React", "Node.js"],
      location: "Pune", jobType: "Remote", employerId: created.employer._id,
      salaryRange: { min: 1000, max: 2000 },
    });
    console.log("2. Job created. Requirements:", created.job.requirements);

    created.app = await Application.create({
      jobId: created.job._id, applicantId: created.seeker._id, matchScore: 100,
    });
    console.log("3. Application created");

    try {
      await Application.create({ jobId: created.job._id, applicantId: created.seeker._id });
      console.log("4. FAIL: duplicate was allowed");
    } catch (e) {
      console.log("4. Duplicate blocked, error code:", e.code); // expect 11000
    }

    try {
      await User.create({ name: "Dup", email: created.seeker.email, password: "secret123" });
      console.log("5. FAIL: duplicate email allowed");
    } catch (e) {
      console.log("5. Duplicate email blocked, error code:", e.code);
    }

    try {
      await Job.create({
        title: "Bad", description: "x", requirements: ["a"], location: "x",
        jobType: "Full-time", employerId: created.employer._id,
        salaryRange: { min: 5000, max: 1000 },
      });
      console.log("6. FAIL: bad salary allowed");
    } catch (e) {
      console.log("6. Validation worked:", e.message);
    }

    const populated = await Application.findById(created.app._id)
      .populate("jobId", "title")
      .populate("applicantId", "name email");
    console.log("7. Populate result:", populated.jobId.title, "|", populated.applicantId.name);
  } finally {
    // Clean up test data
    await Application.deleteMany({ jobId: created.job?._id });
    if (created.job) await Job.findByIdAndDelete(created.job._id);
    if (created.employer) await User.findByIdAndDelete(created.employer._id);
    if (created.seeker) await User.findByIdAndDelete(created.seeker._id);
    await mongoose.disconnect();
    console.log("Cleaned up and disconnected");
  }
})();
