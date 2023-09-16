const express = require("express");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const saltRounds = 10; // The number of salt rounds to use
const app = express();
const port = 3000;

//set the app to use ejs for rendering
app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/points", (req, res) => {
  res.render("points");
});

app.get("/planning", (req, res) => {
  res.render("planning");
});

app.get("/expenses", (req, res) => {
  res.render("expenses");
});

app.get("/community", (req, res) => {
  res.render("community");
});

app.get("/savings-plan", (req, res) => {
  res.render("savings-plan");
});

app.get("/projection", (req, res) => {
  res.render("projection");
});

app.get("/recommendation", (req, res) => {
  res.render("recommendation");
});

app.get("/spending-habits", (req, res) => {
  res.render("spending-habits");
});

app.get("/projected-savings", (req, res) => {
  res.render("projected-savings");
});

app.get("/cardRec", (req, res) => {
  res.render("cardRec");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
