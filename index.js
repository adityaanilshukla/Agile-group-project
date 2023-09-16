const express = require("express");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const saltRounds = 10; // The number of salt rounds to use
const app = express();
const port = 3000;

// Configure SQLite database

const db = new sqlite3.Database("database.db");

// Parse incoming form data
app.use(bodyParser.urlencoded({ extended: false }));

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

app.get("/dinning", (req, res) => {
  res.render("dinning");
});

app.get("/generalSpending", (req, res) => {
  res.render("generalSpending");
});

app.get("/overseasTransaction", (req, res) => {
  res.render("overseasTransaction");
});

//post routes
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Retrieve the hashed password from the SQLite database

  db.get(
    "SELECT * FROM users WHERE email = ?",

    [email],

    (err, row) => {
      if (err || !row) {
        // Authentication failed

        res.send("Login failed. Please try again.");
      } else {
        // Compare the provided password with the stored hashed password

        bcrypt.compare(password, row.password, (bcryptErr, result) => {
          if (bcryptErr || !result) {
            // Authentication failed

            res.send("Login failed. Please try again.");
          } else {
            // Authentication succeeded

            res.send("Login successful.");
          }
        });
      }
    },
  );
});

// Handle registration form submission

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  // Hash the password using bcrypt

  bcrypt.hash(password, saltRounds, (hashErr, hashedPassword) => {
    if (hashErr) {
      // Handle the error (e.g., log it or send an error response)

      console.error(hashErr);

      res.status(500).send("Registration failed. Please try again later.");

      return;
    }

    // Insert the user into the database

    db.run(
      "INSERT INTO users (email, password) VALUES (?, ?)",

      [email, hashedPassword],

      (insertErr) => {
        if (insertErr) {
          // Handle the error (e.g., log it or send an error response)

          console.error(insertErr);

          res.status(500).send("Registration failed. Please try again later.");
        } else {
          // Registration successful

          res.render("login"); // Redirect to the login page
        }
      },
    );
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
