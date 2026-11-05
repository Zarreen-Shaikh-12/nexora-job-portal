const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [60, "Name cannot exceed 60 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // never returned in queries unless explicitly requested
    },
    role: {
      type: String,
      enum: {
        values: ["JobSeeker", "Employer", "Admin"],
        message: "Role must be JobSeeker, Employer or Admin",
      },
      default: "JobSeeker",
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[0-9+\-\s]{7,15}$/, "Please provide a valid phone number"],
    },
    skills: [{ type: String, trim: true, lowercase: true }],
    bio: { type: String, trim: true, maxlength: [500, "Bio cannot exceed 500 characters"] },
    avatar: { type: String, default: "" },

    // Resume path/URL for JobSeekers (used in the upload step later)
    resumeUrl: { type: String, default: "" },

    // Company fields: used only when role === "Employer"
    companyName: { type: String, trim: true, maxlength: 100 },
    companyWebsite: { type: String, trim: true },
    companyDescription: { type: String, trim: true, maxlength: 1000 },

    // Lets an Admin deactivate an account without deleting it
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Hash the password only when it is new or has been changed
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method used during login (Step 3)
userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Note: `unique: true` on email already creates a unique index.
userSchema.index({ role: 1 });

module.exports = mongoose.model("User", userSchema);
