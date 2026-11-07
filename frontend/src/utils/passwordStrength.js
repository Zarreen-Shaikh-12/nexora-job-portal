// Returns { score: 0-4, label }. Advisory only: the backend minimum is 6 characters.
export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: "" };

  let points = 0;
  if (password.length >= 8) points++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points++;
  if (/\d/.test(password)) points++;
  if (/[^A-Za-z0-9]/.test(password)) points++;

  // Very short passwords are always "Weak"; otherwise at least level 1
  const score = password.length < 6 ? 1 : Math.max(points, 1);
  const labels = { 1: "Weak", 2: "Fair", 3: "Good", 4: "Strong" };
  return { score, label: labels[score] };
};
