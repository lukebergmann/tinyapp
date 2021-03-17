// THIS PAGE IS THE MAIN SERVER //

const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//This tells the Express app to use EJS as its templating engine
app.set("view engine", "ejs");

// Install morgan
const morgan = require('morgan');
app.use(morgan('dev'));

const urlDatabase = {

};

app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});

// Route to render the urls_index template
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});

// Route to render the urls_show template
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});

// The root path
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});
//create new url
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {longURL: ""}
  let longURL = req.body.longURL;
  // console.log("Database at new:", urlDatabase)
  urlDatabase[shortURL].longURL = longURL;
  res.redirect(`/urls`);
  // console.log(req.body);  // Log the POST request body to the console
  
});
// post to delete a URL
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls")
});

//post to edit a URL
app.post("/urls/:shortURL", (req, res) => {
  let longURL = req.body.longURL
  let shortURL = req.params.shortURL;
  urlDatabase[shortURL].longURL = longURL;
  res.redirect("/urls");
});

//Post for login
app.post("/login", (req, res) => {
  let username = req.body.username;
  res.cookie('username', username);
  res.redirect("/urls");
});

//Post to logout
app.post("/logout", (req, res) => {
  // Leaving a note here: I can clear cookies properly in the 'username' feild, but I am not clearing cookies properly in myUrls home page. Will look at this tomorrow
  // let username = req.body.username;
  console.log("What is this", urlDatabase)
  res.clearCookie('urlDatabase')
  res.clearCookie('username');
  res.redirect("/urls")
})

// App is listening on port 8080
app.listen(PORT, () => {
  console.log(`This app is listening on port ${PORT}`);
});

// A function to generate a random 6 character code (Alphanumeric and Numerical mixed)
function generateRandomString() {
  return Math.random().toString(36).substr(2, 6);
  
}
