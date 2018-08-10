var express_server = require('./express_server');
var users = express_server.users;

function generateRandomString() {
  var randomString = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < 6; i++)
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));

  return randomString;
}

function emailCheck(userEmail) {
  for (var user in users) {
    if (users[user].email === userEmail) {
      return true;
    }
  }
  return false;
}


function loginVerification(userEmail, userPassword) {
  for (var user in users) {
    if (users[user].email === userEmail && users[user].password === userPassword) {
      return true;
    }
  }
  return false;
}

exports.generateRandomString = generateRandomString;
exports.emailCheck = emailCheck;
exports.loginVerification = loginVerification;