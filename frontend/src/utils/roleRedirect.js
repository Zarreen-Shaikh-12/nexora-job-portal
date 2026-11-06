export const dashboardPathFor = (role) =>
  ({
    JobSeeker: "/dashboard/seeker",
    Employer: "/dashboard/employer",
    Admin: "/dashboard/admin",
  })[role] || "/";
