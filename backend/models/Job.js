const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
    },
    // Skill keywords, e.g. ["react", "node.js", "mongodb"]
    requirements: {
      type: [{ type: String, trim: true, lowercase: true }],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one requirement is needed",
      },
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    salaryRange: {
      min: { type: Number, min: [0, "Minimum salary cannot be negative"], default: 0 },
      max: {
        type: Number,
        min: [0, "Maximum salary cannot be negative"],
        default: 0,
        validate: {
          validator: function (value) {
            // `this` is the document on create/save; skip the check if it isn't
            return !this.salaryRange || value >= this.salaryRange.min;
          },
          message: "Maximum salary must be greater than or equal to minimum salary",
        },
      },
    },
    jobType: {
      type: String,
      enum: {
        values: ["Full-time", "Part-time", "Remote"],
        message: "Job type must be Full-time, Part-time or Remote",
      },
      required: [true, "Job type is required"],
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },
  },
  { timestamps: true }
);

// Public listing: filter by status/type, newest first
jobSchema.index({ status: 1, jobType: 1, createdAt: -1 });
// Employer dashboard: "my jobs"
jobSchema.index({ employerId: 1, createdAt: -1 });

module.exports = mongoose.model("Job", jobSchema);
