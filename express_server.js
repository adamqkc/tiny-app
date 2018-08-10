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
  console.log(urlDatabase);
  res.render("urls_new");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  console.log(urlDatabase);
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { 
    shortURL: req.params.id,
    urls: urlDatabase
  };
  console.log(urlDatabase);
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  console.log(urlDatabase);
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  let shortURL = main.generateRandomString(); // Create shortURL
  req.body[shortURL] = req.body['longURL'];    // create property:value 
  delete req.body['longURL'];
  Object.assign(urlDatabase, req.body);
  console.log(urlDatabase);
  res.redirect("/urls/" + shortURL);
});

app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id]; // TEMP
  console.log(urlDatabase);
  res.redirect('/urls');
});

app.post('/urls/:id', (req, res) => {
  urlDatabase[req.params.id] = req.body.updatedURL;
  console.log(urlDatabase);
  res.redirect('/urls')
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});