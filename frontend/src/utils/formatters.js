export const formatSalary = (range) => {
  const min = range?.min || 0;
  const max = range?.max || 0;
  if (!min && !max) return "Not disclosed";
  const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;
  return min && max ? `${fmt(min)} - ${fmt(max)}` : fmt(max || min);
};

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export const roleLabel = (role) => (role === "JobSeeker" ? "Job Seeker" : role);
