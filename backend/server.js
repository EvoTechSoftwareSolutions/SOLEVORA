const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running");
});

// Register
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  const checkSql = "SELECT * FROM users WHERE email = ?";
  db.query(checkSql, [email], async (checkErr, checkResult) => {
    if (checkErr) {
      console.log(checkErr);
      return res.status(500).json({ message: "Database error" });
    }

    if (checkResult.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertSql =
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
      db.query(insertSql, [name, email, hashedPassword], (insertErr) => {
        if (insertErr) {
          console.log(insertErr);
          return res.status(500).json({ message: "Registration failed" });
        }

        res.json({ message: "User registered successfully" });
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Password hashing failed" });
    }
  });
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Login failed" });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    try {
      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Login failed" });
    }
  });
});

// Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "prasadkumarasinghe725@gmail.com",
    pass: "cagjsncvfzgyejcm",
  },
});

// Forgot password
app.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  const findUserSql = "SELECT * FROM users WHERE email = ?";
  db.query(findUserSql, [email], async (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Email not found" });
    }

    const user = result[0];

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const deleteOldSql = "DELETE FROM password_resets WHERE user_id = ?";
    db.query(deleteOldSql, [user.id], (deleteErr) => {
      if (deleteErr) {
        console.log(deleteErr);
        return res.status(500).json({ message: "Could not clear old reset token" });
      }

      const insertTokenSql =
        "INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES (?, ?, ?)";
      db.query(insertTokenSql, [user.id, tokenHash, expiresAt], async (insertErr) => {
        if (insertErr) {
          console.log(insertErr);
          return res.status(500).json({ message: "Could not create reset token" });
        }

        const resetLink = `http://10.180.71.153:5173/reset-password/${rawToken}`;

        try {
          await transporter.sendMail({
            from: "YOUR_EMAIL@gmail.com",
            to: email,
            subject: "Password Reset Link",
            html: `
              <h2>Password Reset</h2>
              <p>Click below to reset your password:</p>
              <a href="${resetLink}" style="display:inline-block;padding:12px 20px;background:#f97316;color:white;text-decoration:none;border-radius:8px;">
                Reset Password
              </a>
              <p>This link expires in 15 minutes.</p>
            `,
          });

          res.json({ message: "Reset link sent to your email" });
        } catch (mailError) {
          console.log(mailError);
          res.status(500).json({ message: "Email sending failed" });
        }
      });
    });
  });
});

// Verify token
app.get("/verify-reset-token/:token", (req, res) => {
  const { token } = req.params;

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const sql = `
    SELECT * FROM password_resets
    WHERE token_hash = ? AND expires_at > NOW()
  `;

  db.query(sql, [tokenHash], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Token verification failed" });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    res.json({ message: "Token valid" });
  });
});

// Reset password
app.post("/reset-password/:token", (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const findTokenSql = `
    SELECT * FROM password_resets
    WHERE token_hash = ? AND expires_at > NOW()
  `;

  db.query(findTokenSql, [tokenHash], async (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Reset failed" });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const resetRow = result[0];

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updatePasswordSql = "UPDATE users SET password = ? WHERE id = ?";
      db.query(updatePasswordSql, [hashedPassword, resetRow.user_id], (updateErr) => {
        if (updateErr) {
          console.log(updateErr);
          return res.status(500).json({ message: "Could not update password" });
        }

        const deleteTokenSql = "DELETE FROM password_resets WHERE user_id = ?";
        db.query(deleteTokenSql, [resetRow.user_id], (deleteErr) => {
          if (deleteErr) {
            console.log(deleteErr);
            return res.status(500).json({ message: "Password updated but token cleanup failed" });
          }

          res.json({ message: "Password reset successful" });
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Password hashing failed" });
    }
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});