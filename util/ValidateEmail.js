const validateEmail = (email) => {
    // Your email validation logic here
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

module.exports = validateEmail