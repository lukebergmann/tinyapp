// THIS PAGE IS THE MAIN SERVER //

const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//This tells the Express app to use EJS as its templating engine
app.set("view engine", "ejs");

// Install morgan
const morgan = require('morgan');
app.use(morgan('dev'));

// GLOBAL URL DATABASE
const urlDatabase = {};

//Helper Functions 
const urlsForUser = function (userIDFromCookies) {
  const urlResult = {};
  for (let key in urlDatabase) {
    let url = urlDatabase[key];
    if (url.userID === userIDFromCookies) {
      urlResult[key] = url;
    }
  }
  return urlResult;
};

// GLOBAL USER DATABASE 
const users = {};

// The root path
app.get("/", (req, res) => {
  res.send("Hello!");
});

// GET to render My URLs
app.get("/urls", (req, res) => {
  console.log("User Object:", users)
  console.log("req.cookie:", req.cookies["user_id"]);
  const user_id = req.cookies["user_id"]
  const templateVars = { urls: urlsForUser(user_id), user: users[user_id] };
  console.log(templateVars)
  res.render("urls_index", templateVars);
});

//POST new url
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString(req);
  urlDatabase[shortURL] = { longURL: "", userID: req.cookies["user_id"] }
  let longURL = req.body.longURL;
  urlDatabase[shortURL].longURL = longURL;
  res.redirect(`/urls`);
});

// GET to create new URL
app.get("/urls/new", (req, res) => {
  const user_id = req.cookies["user_id"];
  const templateVars = {
    user: users[user_id]
  };
  if (users[user_id]) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login")
  }
});

// GET to render the urls_show template
app.get("/urls/:shortURL", (req, res) => {
  const user_id = req.cookies["user_id"]
  if (users[user_id]) {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[user_id] };
  res.render("urls_show", templateVars);
  } else {
    res.redirect("/404")
  }
});

//POST to edit a URL
app.post("/urls/:shortURL", (req, res) => {
  let longURL = req.body.longURL
  let shortURL = req.params.shortURL;
  const user_id = req.cookies["user_id"];
  if (users[user_id]) {
    urlDatabase[shortURL].longURL = longURL;
    res.redirect("/urls");
  }
});

// GET to transfer long URL into shortURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

// POST to delete a URL
app.post("/urls/:shortURL/delete", (req, res) => {
  const user_id = req.cookies["user_id"];
  if (users[user_id]) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls")
  } else {
  console.log("You Do Not Have Permission To See This!");
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//GET to login
app.get("/login", (req, res) => {
  const user_id = req.cookies["user_id"]
  const templateVars = { user: users[user_id] };
  res.render("urls_login", templateVars)
});

//POST to login
app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  for (let keys in users) {
    if (users[keys].email === email && users[keys].password === password) {
      res.cookie("user_id", users[keys].id);
      res.redirect("/urls");
      // } else if (users[keys].email !== email) {
      //   res.redirect("/403-email");
      // } else if (users[keys].password !== password) {
      //   res.redirect("/403-password");
    }
  }
  res.redirect("/403-email");
});

//POST to logout
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls")
});

//GET to logout
app.get("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls")
})


// GET to registration page
app.get("/register", (req, res) => {
  const { user_id } = req.cookies
  const templateVars = { user: users[user_id] };
  res.render("urls_register", templateVars)
  res.redirect("/register")
});

//POST to register new users in user database
app.post("/register", (req, res) => {
  let newID = generateRandomString();
  let newEmail = req.body.email;
  let newPassword = req.body.password
  if (!newEmail || !newPassword) {
    res.redirect("/404")
  }
  for (let keys in users) {
    if (users[keys].email === newEmail) {
      res.redirect("/404");
    }
  }
  if (newEmail && newPassword) {
    users[newID] = {
      id: newID,
      email: newEmail,
      password: newPassword
    }
  }
  res.cookie('user_id', newID);
  res.redirect("/urls");
});


// GET to 404 page
app.get("/404", (req, res) => {
  const { user_id } = req.cookies;
  const templateVars = { user: users[user_id] };
  res.render("urls_404", templateVars)
});

// POST to redirect from 404 page back to /register
app.post("/404", (req, res) => {
  res.redirect("/register")
});

// GET to 403 page for incorrect email
app.get("/403-email", (req, res) => {
  const { user_id } = req.cookies;
  const templateVars = { user: users[user_id] };
  res.render("urls_403-email", templateVars)
});

// POST to redirect from 403 page back to /login
app.post("/403-email", (req, res) => {
  res.redirect("/login")
});

// GET to 403 page for incorrect password
app.get("/403-password", (req, res) => {
  const templateVars = { users: users, user_id: req.cookies["user_id"] };
  res.render("urls_403-Password", templateVars)
});

// POST to redirect from 403 page back to /login
app.post("/403-password", (req, res) => {
  res.redirect("/login")
});

// App is LISTENING on port 8080
app.listen(PORT, () => {
  console.log(`This app is listening on port ${PORT}`);
});

// GENERATE RANDOM 6 CHARACTER CODE
function generateRandomString() {
  return Math.random().toString(36).substr(2, 6);

}
