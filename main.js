var express_server = require('./express_server');
var users = express_server.users;

function generateRandomString() {
  var shortURL = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    shortURL += characters.charAt(Math.floor(Math.random() * characters.length));

  return shortURL;
}

function emailCheck(email) {
  for (var user in users) {
    if (users.user['email'] === email) {
      return true;
    }
  }
  return false;
}

exports.generateRandomString = generateRandomString;
exports.emailCheck = emailCheck;