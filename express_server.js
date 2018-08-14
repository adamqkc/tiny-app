const express = require('express');
const app = express();
const PORT = 8080; 
const bodyParser = require('body-parser');
const main = require('./main');
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');

// Template users database
const users = {
  'userRandomID': {
    id: 'userRandomID',
    email: 'user@example.com',
    password: bcrypt.hashSync('purple-monkey-dinosaur', 10)
  },
  'user2RandomID': {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: bcrypt.hashSync('dishwasher-funk', 10)
  }
}
// Template URL database
const urlDatabase = {
  'b2xVn2': {
    shortURL: 'b2xVn2',
    longURL: 'http://www.lighthouselabs.ca',
    userID: 'userRandomID'
  },
  '9sm5xK': {
    shortURL: '9sm5xK',
    longURL: 'http://www.google.com',
    userID: 'userRandomID'
  }
};

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['qwerty', 'asdfgh', 'zxcvbn'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

/*-----------------------------------------------------------*/
/*                  GET REQUESTS FOR DAYZZZ                  */
/*-----------------------------------------------------------*/

// Homepage!
app.get('/urls', (req, res) => {
  if (req.session.user_id) {
    let templateVars = { 
      user: users[req.session.user_id],
      urls: main.getUserURLS(urlDatabase, req.session.user_id)
    };
    res.render('urls_index', templateVars);
  } else {
    res.redirect('/login');
  }
});

// Create new short URL!
app.get('/urls/new', (req, res) => {
  if (req.session.user_id) {
    let templateVars = {
      user: users[req.session.user_id],
    }
    res.render('urls_new', templateVars);
  } else {
    res.redirect('/login');
  }
});

// Update and change existing websites 
app.get('/urls/:id', (req, res) => {
  if (!urlDatabase[req.params.id]) {
    res.status(404).send('Page not found!');
  } else if (!req.session.user_id) {
    res.status(401).send('Please login!');
  } else if (urlDatabase[req.params.id].userID !== req.session.user_id) {
    res.status(403).send('You are not authorized!');
  } else {
    let templateVars = { 
      user: users[req.session.user_id],
      shortURL: req.params.id,
      urls: main.getUserURLS(urlDatabase, req.session.user_id)
    };
    res.render('urls_show', templateVars);
  }
});

// Redirect to website if short URL is valid
app.get('/u/:shortURL', (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.status(404).send('Page not found!');
  } else {
    let longURL = urlDatabase[req.params.shortURL]['longURL'];
    res.redirect(longURL);
  }
}); 

// Registration page
app.get('/register', (req, res) => {
  res.render('register')
})

// Login page
app.get('/login', (req, res) => {
  res.render('login')
})

/*-----------------------------------------------------------*/
/*     POST REQUESTING STRAIGHT INTO NEXT WEEK BABAYYYYY     */
/*-----------------------------------------------------------*/

// Add new URL data to urlDatabase!
app.post('/urls', (req, res) => {
  let shortURL = main.generateRandomString();
  let urlObj = {};
  urlObj.shortURL = shortURL;
  urlObj.longURL = req.body['longURL'];
  urlObj.userID = req.session.user_id;
  urlDatabase[shortURL] = urlObj;
  res.redirect('/urls/' + shortURL);
});

// Delete URL data from urlDatabase!
app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id]; 
  res.redirect('/urls');
});

// Edit existing long URLS
app.post('/urls/:id', (req, res) => {
  if (req.body.newURL === '') {
    res.status(400).send('Error code 400! Please enter a valid website!')
  } else {
    urlDatabase[req.params.id]['longURL'] = req.body.newURL
    console.log(urlDatabase)
    res.redirect('/urls')
  }
});

// Login and user verification 
app.post('/login', (req, res) => {
  if (main.loginVerification(req.body.email, req.body.password, users, req)) {
    res.redirect('/urls');
  } else {
    res.status(403).send('Email or password is incorrect, please try again.');
  }
})

// Logs out user and deletes cookie
app.post('/logout', (req, res) => {
  req.session.user_id = null;
  res.redirect('/urls');
})

// Creates and saves new user account data 
app.post('/register', (req, res) => {
  if (req.body.email === '' || req.body.password === '') {
    res.status(400).send('Error code 400! Please fill out both fields.');
  } else if (main.emailCheck(req.body.email, users)) {
    res.status(400).send('Error code 400! Please enter a different email.');
  } else {
    let userID = main.generateRandomString();
    users[userID] = {
      id: userID,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    }
    req.session.user_id = users[userID];
    res.redirect('/urls');
  }
})

// Hey! ... Listen!
app.listen(PORT, () => {
  console.log(`Navi listening on port ${PORT}!`);
});