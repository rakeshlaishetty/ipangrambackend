const bcrypt = require("bcrypt");

// Function to hash a password
const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
};

// Function to compare a password with a hashed password
const comparePassword = async (password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

module.exports = { hashPassword, comparePassword };
// Compare the password with the hashed password
// const isMatch = await comparePassword(plainPassword, hashedPassword);
