function generateRandomString() {
  var shortURL = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    shortURL += characters.charAt(Math.floor(Math.random() * characters.length));

  return shortURL;
}

exports.generateRandomString = generateRandomString;
