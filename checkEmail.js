//Helper Function to check if the email is in the system
const checkEmail = function (users, email) {
  for (let user in users) {
    if (users[user].email === email) {
      return true;
    }
  }
  return false;
};

module.exports = checkEmail;