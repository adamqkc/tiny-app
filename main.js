function generateRandomString() {
  var randomString = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < 6; i++)
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));

  return randomString;
}

function emailCheck(userEmail, users) {
  for (var user in users) {
    if (users[user].email === userEmail) {
      return true;
    }
  }
  return false;
}

function loginVerification(userEmail, userPassword, users, res) {
  for (var user in users) {
    if (users[user]['email'] === userEmail && users[user]['password'] === userPassword) {
      res.cookie('user_id', user)
      return true;
    }
  }
  return false;
}

function getUserURLS(urlDatabase, cookie) {
  var userURLS = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === cookie) {
      userURLS[url] = urlDatabase[url];
    }
  }
  return userURLS;
}



exports.generateRandomString = generateRandomString;
exports.emailCheck = emailCheck;
exports.loginVerification = loginVerification;
exports.getUserURLS = getUserURLS