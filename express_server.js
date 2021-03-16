// THIS PAGE IS THE MAIN SERVER //

const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//This tells the Express app to use EJS as its templating engine
app.set("view engine", "ejs");

// Install morgan
const morgan = require('morgan');
app.use(morgan('dev'));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// Route to render the urls_index template
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// Route to render the urls_show template
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL };
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
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
  console.log(req.body);  // Log the POST request body to the console
  
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
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
