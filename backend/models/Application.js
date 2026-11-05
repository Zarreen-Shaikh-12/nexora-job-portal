const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeUrl: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Rejected"],
      default: "Applied",
    },
    // Snapshot of the ATS result at the moment of applying
    matchScore: { type: Number, min: 0, max: 100, default: 0 },
    matchedSkills: [{ type: String }],
    missingSkills: [{ type: String }],
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// One application per candidate per job (enforced by the database)
applicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });
// Employer view: applicants for a job, best match first
applicationSchema.index({ jobId: 1, matchScore: -1 });
// Job seeker view: my applications, newest first
applicationSchema.index({ applicantId: 1, appliedAt: -1 });

module.exports = mongoose.model("Application", applicationSchema);
