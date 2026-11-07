// Turns the backend's { errors: [{ field, message }] } into { field: message }
export const extractFieldErrors = (err) => {
  const list = err.response?.data?.errors;
  if (!Array.isArray(list)) return {};

  const result = {};
  list.forEach(({ field, message }) => {
    const key = String(field).split(/[.[]/)[0]; // "skills[0]" -> "skills"
    if (!result[key]) result[key] = message;
  });
  return result;
};
