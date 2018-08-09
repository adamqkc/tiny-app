var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
var main = require('./main');

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

var urlDatabase = {
"b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { 
    shortURL: req.params.id,
    urls: urlDatabase
  };
  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
  let shortURL = main.generateRandomString(); // Create shortURL
  req.body[shortURL] = req.body['longURL'];    // create property:value 
  delete req.body['longURL'];
  Object.assign(urlDatabase, req.body);
  console.log(urlDatabase);
  res.redirect("/urls/" + shortURL);
});

app.get("/u/:shortURL", (req, res) => {
  console.log(req.params);
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});