const express = require('express');
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require('body-parser');
const main = require('./main');
const cookieParser = require('cookie-parser');
const users = {
  'userRandomID': {
    id: 'userRandomID',
    email: 'user@example.com',
    password: 'purple-monkey-dinosaur'
  },
  'user2RandomID': {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: 'dishwasher-funk'
  }
}
const urlDatabase = {
'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};
// const cookieSession = require('cookie-session')

// import functions not working, temporarily placing function here
function emailCheck(email) {
  for (var user in users) {
    if (users[user]['email'] === email) {
      return true;
    }
  }
  return false;
};

function loginVerification(userEmail, userPassword, res) {
  for (var user in users) {
    if (users[user]['email'] === userEmail && users[user]['password'] === userPassword) {
      res.cookie('user_id', user)
      return true;
    }
  }
  return false;
}
////////////////

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

app.get('/urls', (req, res) => {
  if (req.cookies['user_id']) {
    let templateVars = { 
      user: users[req.cookies['user_id']],
      urls: urlDatabase
    };
    res.render('urls_index', templateVars);
  } else {
    res.render('login');
  }
});

app.get('/urls/:id', (req, res) => {
  let templateVars = { 
    user: users[req.cookies['user_id']],
    shortURL: req.params.id,
    urls: urlDatabase
  };
  res.render('urls_show', templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get('/register', (req, res) => {
  res.render('register')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/urls', (req, res) => {
  let shortURL = main.generateRandomString(); 
  req.body[shortURL] = req.body['longURL'];    
  delete req.body['longURL'];
  Object.assign(urlDatabase, req.body);
  res.redirect('/urls/' + shortURL);
});

app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id]; 
  res.redirect('/urls');
});

app.post('/urls/:id', (req, res) => {
  urlDatabase[req.params.id] = req.body.updatedURL;
  res.redirect('/urls')
});

app.post('/login', (req, res) => {
  if (loginVerification(req.body.email, req.body.password, res)) {
    res.redirect('/urls');
  } else {
    res.status(403).send('Email or password is incorrect, please try again.');
  }
})

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
})

app.post('/register', (req, res) => {
  if (req.body.email === '' || req.body.password === '') {
    res.status(400).send('Error code 400! Please fill out both fields.');
  } else if (emailCheck(req.body.email)) {
    res.status(400).send('Error code 400! Please enter a different email.');
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