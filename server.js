const express = require("express");
const sqlite3 = require("better-sqlite3");
const nodemailer = require("nodemailer");
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3("fadhili.db");
console.log("Connected to the SQLite database");

// Create users table if it doesn't exist
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT,
    password TEXT
  )
`
).run();

// Email transporter config (using Gmail SMTP for example)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "josenjuguna688@gmail.com", // your Gmail
    pass: "aqvlbzuaaawdilks", // your Gmail App Password (NOT your regular Gmail password)
  },
});

// Register route
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  const stmt = db.prepare(
    `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`
  );
  const info = stmt.run(username, email, password);
  // Login route
  app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const stmt = db.prepare(
      `SELECT * FROM users WHERE email = ? AND password = ?`
    );
    const user = stmt.get(email, password);

    if (user) {
      res.json({ message: "Login successful", user });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });

  // Email options
  const mailOptions = {
    from: "josenjuguna688@gmail.com",
    to: "josenjuguna688@gmail.com",
    subject: "New User Registration",
    text: `New user registered:\n\nUsername: ${username}\nEmail: ${email}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  res.json({
    message: "User registered successfully",
    userId: info.lastInsertRowid,
  });
});

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to Fadhili Website");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // <- ADD this to parse form data
