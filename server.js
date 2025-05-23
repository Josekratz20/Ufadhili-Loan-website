const express = require("express");
const sqlite3 = require("better-sqlite3");
const nodemailer = require("nodemailer");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// SQLite DB
const db = new sqlite3("fadhili.db");
console.log("Connected to the SQLite database");

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

// Email Transporters
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "josenjuguna688@gmail.com",
    pass: "aqvlbzuaaawdilks",
  },
});
const transporterUfadhili = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ufadhilicapitallimited@gmail.com",
    pass: "tboy rxwh sdqe sqtn",
  },
});

// ===== ROUTES =====

// Register
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  const stmt = db.prepare(
    `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`
  );
  const info = stmt.run(username, email, password);

  const mailOptions = {
    from: "josenjuguna688@gmail.com",
    to: "josenjuguna688@gmail.com, ufadhilicapitallimited@gmail.com",
    subject: "New User Registration",
    text: `New user registered:\n\nUsername: ${username}\nEmail: ${email}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.error("Error sending email:", error);
    else console.log("Email sent:", info.response);
  });

  res.json({
    message: "User registered successfully",
    userId: info.lastInsertRowid,
  });
});

// Apply for Loan
app.post("/apply-loan", (req, res) => {
  const {
    fullname,
    idnumber,
    email,
    phone1,
    phone2,
    amount,
    duration,
    referee1_name,
    referee1_phone,
    referee2_name,
    referee2_phone,
  } = req.body;

  // Validation for max 3 months
  if (parseInt(duration) > 3) {
    return res.status(400).send("Loan duration cannot exceed 3 months.");
  }

  const mailOptions = {
    from: "josenjuguna688@gmail.com",
    to: "josenjuguna688@gmail.com, ufadhilicapitallimited@gmail.com",
    subject: "New Loan Application",
    text: `New loan application details:
Name: ${fullname}
ID Number: ${idnumber}
Email: ${email}
Phone 1: ${phone1}
Phone 2: ${phone2}
Amount: Ksh ${amount}
Duration: ${duration} months
Referee 1: ${referee1_name} (${referee1_phone})
Referee 2: ${referee2_name} (${referee2_phone})`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending loan application email:", error);
      return res.status(500).send("Failed to send application.");
    }
    console.log("Loan application email sent:", info.response);
    res.send("Loan application submitted successfully!");
  });
});

// Login page redirect
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Register page
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

// About page
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"));
});

// Application form page
app.get("/apply", (req, res) => {
  res.sendFile(path.join(__dirname, "public/application", "application.html"));
});

// Homepage after login
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
