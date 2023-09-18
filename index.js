const express = require("express");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const session = require("express-session"); // Added session support
const saltRounds = 10; // The number of salt rounds to use
const app = express();
const port = 3000;

// Import the createDemoUser function
const createDemoUser = require("./public/scripts/demoUser");
const expenseFormatter = require("./public/scripts/expenseFormatter");

// Configure SQLite database
const db = new sqlite3.Database("database.db");

// Parse incoming form data
app.use(bodyParser.urlencoded({ extended: false }));

// Set up sessions
app.use(
  session({
    secret: "secret", // Change this to a secret key for session encryption
    resave: false,
    saveUninitialized: true,
  }),
);

//set the app to use ejs for rendering
app.set("view engine", "ejs");

app.use(express.static("public"));

// Middleware for checking authentication
function requireAuth(req, res, next) {
  if (req.session.userId) {
    // User is authenticated, proceed to the next route handler
    next();
  } else {
    // User is not authenticated, redirect to the login page
    res.redirect("/");
  }
}

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

// Protected routes
app.get("/home", requireAuth, (req, res) => {
  res.render("home");
});

app.get("/planning", requireAuth, (req, res) => {
  res.render("planning");
});

app.get("/expenses", requireAuth, (req, res) => {
  res.render("expenses");
});

// retrieve threads and posts
app.get("/community", (req, res) => {
  db.all("SELECT * FROM threads ORDER BY id DESC", (err, threads) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving threads.");
    } else {
      db.all("SELECT * FROM posts", (err, posts) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error retrieving posts.");
        } else {
          res.render("community", { threads, posts });
        }
      });
    }
  });
});

app.get("/savings-plan", requireAuth, (req, res) => {
  res.render("savings-plan");
});

app.get("/projection", requireAuth, (req, res) => {
  // Fetch data from the database (userData and expenseByVendor)
  const userId = req.session.userId; // Get the user's ID from the session

  db.get(
    "SELECT * FROM userData WHERE userId = ?",
    [userId],
    (userDataErr, userDataRow) => {
      if (userDataErr) {
        console.error("Error fetching userData:", userDataErr);
        res.status(500).send("Internal Server Error");
        return;
      }

      // Fetch expenseByVendor data for the user
      db.all(
        "SELECT * FROM expenseByVendor WHERE userId = ?",
        [userId],
        (expenseByVendorErr, expenseByVendorData) => {
          if (expenseByVendorErr) {
            console.error(
              "Error fetching expenseByVendor data:",
              expenseByVendorErr,
            );
            res.status(500).send("Internal Server Error");
            return;
          }

          // Format the expenseByVendor data using the function from the module
          const formattedExpenseByVendor =
            expenseFormatter.formatExpenseByVendorData(
              userDataRow,
              expenseByVendorData,
            );

          // Render the projection.ejs template with the fetched and formatted data
          res.render("projection", {
            userData: userDataRow,
            expenseByVendor: formattedExpenseByVendor,
          });
        },
      );
    },
  );
});

app.get("/recommendation", requireAuth, (req, res) => {
  res.render("recommendation");
});

app.get("/spending-habits", requireAuth, (req, res) => {
  res.render("spending-habits");
});

app.get("/projected-savings", requireAuth, (req, res) => {
  res.render("projected-savings");
});

app.get("/cardRec", requireAuth, (req, res) => {
  res.render("cardRec");
});

app.get("/dinning", requireAuth, (req, res) => {
  res.render("dinning");
});

app.get("/generalSpending", requireAuth, (req, res) => {
  res.render("generalSpending");
});

app.get("/overseasTransaction", requireAuth, (req, res) => {
  res.render("overseasTransaction");
});

app.get("/enter-expenses", requireAuth, (req, res) => {
  res.render("enter-expenses");
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
            // Store user information in the session
            req.session.userId = row.id;

            res.redirect("/home"); // Redirect to the home page
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

// create a new thread
app.post("/threads", (req, res) => {
  const { title } = req.body;
  db.run("INSERT INTO threads (title) VALUES (?)", [title], function(err) {
    if (err) {
      console.error(err);
      res.status(500).send("Error creating a new thread.");
    } else {
      res.redirect("community");
    }
  });
});

// create a new post in a thread
app.post("/posts", (req, res) => {
  const { thread_id, content } = req.body;
  db.run(
    "INSERT INTO posts (thread_id, content) VALUES (?, ?)",
    [thread_id, content],
    function(err) {
      if (err) {
        console.error(err);
        res.status(500).send("Error creating a new post.");
      } else {
        res.redirect("community");
      }
    },
  );
});

// Create tables if they don't exist
db.serialize(() => {
  // Create 'users' table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      email TEXT NOT NULL,
      password TEXT NOT NULL
    )
  `);

  // Create 'expensesByCategory' table
  db.run(`
    CREATE TABLE IF NOT EXISTS expenseByCategory (
      id INTEGER PRIMARY KEY,
      userId INTEGER,
      category TEXT,
      amount REAL,
      month INTEGER,
      year INTEGER,
      FOREIGN KEY (userId) REFERENCES users (id)
    )
  `);

  // Create 'expenseByVendor' table
  db.run(`
    CREATE TABLE IF NOT EXISTS expenseByVendor (
      id INTEGER PRIMARY KEY,
      userId INTEGER,
      category TEXT,
      vendorName TEXT,
      amount REAL,
      month INTEGER,
      year INTEGER,
      FOREIGN KEY (userId) REFERENCES users (id)
    )
  `);

  // Create 'userData' table
  db.run(`
    CREATE TABLE IF NOT EXISTS userData (
      id INTEGER PRIMARY KEY,
      userId INTEGER,
      startMonthlySavingsGoal REAL,
      startMonthlyIncome REAL,
      startMonthlyExpenditure REAL,
      userSalaryIncreaseRate REAL,
      userInflationRate REAL,
      beginYear INTEGER,
      startPlanDate INTEGER,
      targetDate INTEGER,
      FOREIGN KEY (userId) REFERENCES users (id)
    )
  `);

  // Create 'threads' table
  db.run(`
    CREATE TABLE IF NOT EXISTS threads (
      id INTEGER PRIMARY KEY,
      title TEXT
    )
  `);

  // Create 'posts' table
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY,
      thread_id INTEGER,
      content TEXT,
      Field4 INTEGER,
      FOREIGN KEY (Field4) REFERENCES threads (id)
    )
  `);
});
createDemoUser();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
