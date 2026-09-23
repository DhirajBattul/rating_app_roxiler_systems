// Simple validation helpers used across the app.
// Rules taken directly from the assignment requirements.

const isValidName = (name) => {
  if (!name) return false;
  return name.length >= 20 && name.length <= 60;
};

const isValidAddress = (address) => {
  if (!address) return true; // address is optional in some places
  return address.length <= 400;
};

const isValidPassword = (password) => {
  if (!password) return false;
  const lengthOk = password.length >= 8 && password.length <= 16;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-+=]/.test(password);
  return lengthOk && hasUpperCase && hasSpecialChar;
};

const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  isValidName,
  isValidAddress,
  isValidPassword,
  isValidEmail,
};
