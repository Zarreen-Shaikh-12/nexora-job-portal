// Escapes characters that have special meaning in regular expressions,
// so user input is treated as plain text.
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = escapeRegex;
