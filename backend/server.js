const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend running");
});

// Normal register
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  const checkSql = "SELECT * FROM users WHERE email = ?";
  db.query(checkSql, [email], (checkErr, checkResult) => {
    if (checkErr) {
      console.log(checkErr);
      return res.status(500).json({ message: "Database error" });
    }

    if (checkResult.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const insertSql =
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(insertSql, [name, email, password], (insertErr, result) => {
      if (insertErr) {
        console.log(insertErr);
        return res.status(500).json({ message: "Registration failed" });
      }

      res.json({ message: "User registered successfully" });
    });
  });
});

// Social register (dummy Google / Apple)
app.post("/social-register", (req, res) => {
  const { name, email } = req.body;

  const defaultPassword = "social_login";

  const checkSql = "SELECT * FROM users WHERE email = ?";
  db.query(checkSql, [email], (checkErr, checkResult) => {
    if (checkErr) {
      console.log(checkErr);
      return res.status(500).json({ message: "Database error" });
    }

    if (checkResult.length > 0) {
      return res.json({ message: "User already exists. Social login successful" });
    }

    const insertSql =
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(insertSql, [name, email, defaultPassword], (insertErr, result) => {
      if (insertErr) {
        console.log(insertErr);
        return res.status(500).json({ message: "Social registration failed" });
      }

      res.json({ message: "Social login successful" });
    });
  });
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Login failed" });
    }

    if (result.length > 0) {
      res.json({
        message: "Login successful",
        user: result[0],
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});