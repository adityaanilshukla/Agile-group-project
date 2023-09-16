const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const sqlite3 = require("sqlite3").verbose();

//set the app to use ejs for rendering
app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
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

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/cardRec", (req, res) => {
  res.render("cardRec");
});

// app.post('/login', (req, res) => {
//   const { username, password } = req.body;
//   // Check the user's credentials in the SQLite database
//   db.get(
//     'SELECT * FROM users WHERE username = ? AND password = ?',
//     [username, password],
//     (err, row) => {
//       if (err || !row) {
//         // Authentication failed
//         res.send('Login failed. Please try again.');
//       } else {
//         // Authentication succeeded
//         res.send('Login successful.');
//       }
//     }
//   );
// });
//

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
