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
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
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
  let newLongURL = req.body.longURL;
  // console.log("Database at new:", urlDatabase)
  urlDatabase[shortURL].longURL = newLongURL;
  console.log(urlDatabase)
  res.redirect(`/urls/${shortURL}`);
  // console.log(req.body);  // Log the POST request body to the console
  
});
// post to delete a URL
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls")
})
//post to edit a URL
app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL].longURL = req.body.editURL;
  res.redirect("/urls")
})

//edit url submission
app.get("/urls/:shortURL", (req, res) => {
  
})

// App is listening on port 8080
app.listen(PORT, () => {
  console.log(`This app is listening on port ${PORT}`);
});

// A function to generate a random 6 character code (Alphanumeric and Numerical mixed)
function generateRandomString() {
 return Math.random().toString(36).substr(2, 6);

}
