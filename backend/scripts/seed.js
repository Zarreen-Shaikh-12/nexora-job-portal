const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Contact = require("../models/Contact");
const { calculateMatchScore } = require("../utils/matchScore");

// Development-only password shared by all demo accounts
const DEMO_PASSWORD = "Password@123";

const userData = [
  { name: "Admin User", email: "admin@jobportal.com", role: "Admin" },
  // Employers (index 1-3)
  { name: "Priya Sharma", email: "priya@techcorp.com", role: "Employer", phone: "9876500001",
    companyName: "TechCorp Solutions", companyWebsite: "https://techcorp.example.com",
    companyDescription: "Product engineering company building web platforms." },
  { name: "Rahul Mehta", email: "rahul@innovatech.com", role: "Employer", phone: "9876500002",
    companyName: "InnovaTech", companyWebsite: "https://innovatech.example.com",
    companyDescription: "Software services and cloud consulting." },
  { name: "Sneha Kulkarni", email: "sneha@datawise.com", role: "Employer", phone: "9876500003",
    companyName: "DataWise Analytics", companyWebsite: "https://datawise.example.com",
    companyDescription: "Data and analytics solutions for retail." },
  // Job seekers (index 4-9)
  { name: "Asha Patil", email: "asha@demo.com", role: "JobSeeker", phone: "9876500011",
    skills: ["react", "node.js", "javascript", "html", "css", "git"], bio: "Fresher full stack developer." },
  { name: "Kiran Rao", email: "kiran@demo.com", role: "JobSeeker", phone: "9876500012",
    skills: ["react", "node.js", "mongodb", "express", "docker", "git", "javascript"], bio: "MERN developer with 2 years experience." },
  { name: "Neha Singh", email: "neha@demo.com", role: "JobSeeker", phone: "9876500013",
    skills: ["python", "sql", "excel", "statistics", "power bi"], bio: "Aspiring data analyst." },
  { name: "Arjun Desai", email: "arjun@demo.com", role: "JobSeeker", phone: "9876500014",
    skills: ["html", "css", "javascript", "react", "tailwind css", "figma"], bio: "Frontend developer and designer." },
  { name: "Divya Nair", email: "divya@demo.com", role: "JobSeeker", phone: "9876500015",
    skills: ["java", "spring boot", "mysql", "git"], bio: "Java backend developer." },
  { name: "Rohan Gupta", email: "rohan@demo.com", role: "JobSeeker", phone: "9876500016",
    skills: ["python", "git", "sql", "node.js"], bio: "Computer science graduate." },
];

// employer: index into the employers (0 = Priya, 1 = Rahul, 2 = Sneha)
const jobData = [
  { employer: 0, title: "MERN Stack Developer", location: "Pune", jobType: "Full-time",
    requirements: ["react", "node.js", "mongodb", "express"], salaryRange: { min: 400000, max: 700000 }, status: "Open",
    description: "Build and maintain full stack web applications using the MERN stack." },
  { employer: 0, title: "Frontend Developer (React)", location: "Pune", jobType: "Remote",
    requirements: ["react", "javascript", "tailwind css", "html", "css"], salaryRange: { min: 300000, max: 600000 }, status: "Open",
    description: "Create responsive user interfaces with React and Tailwind CSS." },
  { employer: 1, title: "Node.js Backend Engineer", location: "Bengaluru", jobType: "Full-time",
    requirements: ["node.js", "express", "mongodb", "rest api", "jwt"], salaryRange: { min: 600000, max: 1000000 }, status: "Open",
    description: "Design secure REST APIs and manage MongoDB databases." },
  { employer: 2, title: "Data Analyst", location: "Mumbai", jobType: "Full-time",
    requirements: ["python", "sql", "excel", "power bi", "statistics"], salaryRange: { min: 350000, max: 650000 }, status: "Open",
    description: "Analyze business data and build dashboards for stakeholders." },
  { employer: 2, title: "Python Developer Intern", location: "Remote", jobType: "Part-time",
    requirements: ["python", "git", "sql"], salaryRange: { min: 10000, max: 25000 }, status: "Open",
    description: "Assist the team with scripting, automation and data tasks." },
  { employer: 1, title: "Full Stack Developer", location: "Hyderabad", jobType: "Full-time",
    requirements: ["react", "node.js", "mongodb", "docker", "git"], salaryRange: { min: 700000, max: 1200000 }, status: "Open",
    description: "Own features end to end across frontend, backend and deployment." },
  { employer: 2, title: "UI/UX Designer", location: "Pune", jobType: "Part-time",
    requirements: ["figma", "adobe xd", "css", "html"], salaryRange: { min: 200000, max: 400000 }, status: "Open",
    description: "Design intuitive interfaces and prototypes for web products." },
  { employer: 1, title: "Java Developer", location: "Pune", jobType: "Full-time",
    requirements: ["java", "spring boot", "mysql", "git"], salaryRange: { min: 500000, max: 900000 }, status: "Closed",
    description: "Develop enterprise services using Java and Spring Boot." },
];

// [seekerIndex (0-5), jobIndex (0-7), status]
const applicationData = [
  [0, 0, "Applied"], [0, 1, "Shortlisted"], [0, 5, "Applied"],
  [1, 0, "Shortlisted"], [1, 2, "Applied"], [1, 5, "Shortlisted"],
  [2, 3, "Shortlisted"], [2, 4, "Applied"],
  [3, 1, "Shortlisted"], [3, 6, "Applied"],
  [4, 7, "Rejected"],
  [5, 4, "Applied"], [5, 0, "Rejected"],
];

const contactData = [
  { name: "Amit Verma", email: "amit@example.com", message: "How can I update my resume after applying to a job?", status: "Unread" },
  { name: "Sara Khan", email: "sara@example.com", message: "Our company wants to post multiple openings. Is there a limit?", status: "Unread" },
  { name: "Vikram Joshi", email: "vikram@example.com", message: "I forgot my password. Please guide me on how to reset it.", status: "Replied" },
  { name: "Pooja Iyer", email: "pooja@example.com", message: "Great platform! Could you add email alerts for new jobs?", status: "Replied" },
];

const seed = async () => {
  if (process.env.NODE_ENV === "production") {
    console.error("Refusing to seed: NODE_ENV is production.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Clearing existing data...");
  await Promise.all([User.init(), Job.init(), Application.init(), Contact.init()]);
  await Promise.all([
    Application.deleteMany({}), Job.deleteMany({}), User.deleteMany({}), Contact.deleteMany({}),
  ]);

  // create() runs the pre-save hook, so passwords get hashed
  const users = await User.create(userData.map((u) => ({ ...u, password: DEMO_PASSWORD })));
  const employers = users.filter((u) => u.role === "Employer");
  const seekers = users.filter((u) => u.role === "JobSeeker");

  const jobs = await Job.create(
    jobData.map(({ employer, ...rest }) => ({ ...rest, employerId: employers[employer]._id }))
  );

  const applications = applicationData.map(([s, j, status]) => {
    const { score, matchedSkills, missingSkills } = calculateMatchScore(jobs[j].requirements, seekers[s].skills);
    return {
      jobId: jobs[j]._id,
      applicantId: seekers[s]._id,
      resumeUrl: `https://example.com/resumes/${seekers[s].name.split(" ")[0].toLowerCase()}.pdf`,
      status,
      matchScore: score,
      matchedSkills,
      missingSkills,
    };
  });
  await Application.insertMany(applications);
  await Contact.insertMany(contactData);

  console.log(`Seeded: ${users.length} users, ${jobs.length} jobs, ${applications.length} applications, ${contactData.length} contacts`);
  console.log(`\nDemo password for ALL accounts (development only): ${DEMO_PASSWORD}`);
  console.log("Admin:      admin@jobportal.com");
  console.log("Employers:  priya@techcorp.com, rahul@innovatech.com, sneha@datawise.com");
  console.log("Seekers:    asha@demo.com, kiran@demo.com, neha@demo.com, arjun@demo.com, divya@demo.com, rohan@demo.com");

  await mongoose.disconnect();
};

seed().catch(async (err) => {
  console.error("Seeding failed:", err.message);
  await mongoose.disconnect();
  process.exit(1);
});
