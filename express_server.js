const express = require('express');
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require('body-parser');
const main = require('./main');
const cookieParser = require('cookie-parser');
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}
const urlDatabase = {
'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};
// const cookieSession = require('cookie-session')

// import function not working, temporarily placing function here
function emailCheck(email) {
  for (var user in users) {
    if (users[user]['email'] === email) {
      return true;
    }
  }
  return false;
}

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(cookieSession({
//   name: 'session',
//   keys: ['key1', 'key2']
// }))


app.get('/urls/new', (req, res) => {
  console.log(urlDatabase);
  res.render('urls_new');
});

app.get('/urls', (req, res) => {
  let templateVars = { 
    username: req.cookies['username'],
    urls: urlDatabase 
  };
  console.log(urlDatabase);
  res.render('urls_index', templateVars);
});

app.get('/urls/:id', (req, res) => {
  let templateVars = { 
    username: req.cookies['username'],
    shortURL: req.params.id,
    urls: urlDatabase
  };
  console.log(urlDatabase);
  res.render('urls_show', templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  console.log(urlDatabase);
  res.redirect(longURL);
});

app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/urls', (req, res) => {
  let shortURL = main.generateRandomString(); // Create shortURL
  req.body[shortURL] = req.body['longURL'];    // create property:value 
  delete req.body['longURL'];
  Object.assign(urlDatabase, req.body);
  console.log(urlDatabase);
  res.redirect('/urls/' + shortURL);
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

app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls');
})

app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls')
})

app.post('/register', (req, res) => {
  if (req.body.email === '' || req.body.password === '') {
    res.status(400).send('Please fill in both fields. <a href="/register">Return to registration</a>');
  } else if (emailCheck(req.body.email)) {
    res.status(400).send('Email already exists, please try again. <a href="/register">Return to registration</a>');
  } else {
    let userID = main.generateRandomString();
    users[userID] = {
      id: userID,
      email: req.body.email,
      password: req.body.password
    }
    console.log(users);
    res.cookie('user_id', main.generateRandomString());
    res.redirect('/urls')
  }
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

exports.users = users;