const db = require("../db/db.js");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { loginLog, logoutLog } = require("./logController");
// ✅ FIXED Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "miniproject783@gmail.com",
    pass: "wwgaucxltubvfwbw", // Gmail App Password
  },
});

transporter.verify((error) => {
  if (error) {
    console.log("Transporter Error:", error);
  } else {
    console.log("Transporter is ready to send emails");
  }
});

// ---------------------------
// REGISTER → Send OTP
// ---------------------------
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const checkSql = `SELECT * FROM users WHERE LOWER(email) = LOWER($1) AND is_verified = 1`;

  try {
    const result = await db.query(checkSql, [email]);

    if (result.rows.length > 0) {
      return res.json({ success: false, message: "Email already exists" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    console.log(otp)
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertSql = `
      INSERT INTO users (name, email, password, role, otp, is_verified)
      VALUES ($1, $2, $3, $4, $5, 0)
      ON CONFLICT (email)
      DO UPDATE SET 
        name = EXCLUDED.name,
        password = EXCLUDED.password,
        role = EXCLUDED.role,
        otp = EXCLUDED.otp
    `;

    await db.query(insertSql, [name, email, hashedPassword, role, otp]);

    const mailOptions = {
      from: "miniproject783@gmail.com",
      to: email,
      subject: "Your OTP Verification Code",
      text: `Hello ${name},\n\nYour OTP is: ${otp}\n\nEnter this OTP to verify your email.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Registered! OTP sent to your email.",
    });

  } catch (err) {
    console.log("DB Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------------------
// VERIFY OTP
// ---------------------------
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const sql = `SELECT * FROM users WHERE LOWER(email) = LOWER($1) AND otp = $2`;

  try {
    const result = await db.query(sql, [email, otp]);

    if (result.rows.length === 0) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    const updateSql = `UPDATE users SET is_verified = 1 WHERE LOWER(email) = LOWER($1)`;
    await db.query(updateSql, [email]);

    res.json({ success: true, message: "OTP verified! You can now login." });

  } catch (err) {
    console.log("DB Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------------------
// LOGIN
// ---------------------------
const login = async (req, res) => {
  const { email, password } = req.body;

  const sql = `SELECT * FROM users WHERE LOWER(email) = LOWER($1)`;

  try {
    const result = await db.query(sql, [email]);

    if (result.rows.length === 0) {
      return res.json({ success: false, message: "User not found" });
    }

    const user = result.rows[0];

    if (user.is_verified === 0) {
      return res.json({
        success: false,
        message: "Please verify your email first",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: "Incorrect password" });
    }
    // ✅ record login activity
    await loginLog(user.id);
    // ✅ Make sure role is returned
    return res.json({
      success: true,
      message: "Login successful",
      token: "logged_in",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,  // VERY IMPORTANT
      },
    });
    

    

  } catch (err) {
    console.log("DB Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const logout = async (req, res) => {
  const { userId } = req.body;

  try {
    await logoutLog(userId);

    res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.log("Logout error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// ---------------------------
// FORGOT PASSWORD
// ---------------------------
const forgotPassword = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();

  try {
    const userCheck = await db.query(
      "SELECT * FROM users WHERE LOWER(email) = $1 AND is_verified = 1",
      [email]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: "Email not found" });
    }

    const resetOtp = String(Math.floor(100000 + Math.random() * 900000));
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await db.query(
      "UPDATE users SET reset_otp = $1, reset_otp_expiry = $2 WHERE LOWER(email) = $3",
      [resetOtp, expiry, email]
    );

    const mailOptions = {
      from: "miniproject783@gmail.com",
      to: email,
      subject: "Password Reset OTP",
      text: `Your password reset OTP is ${resetOtp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Reset OTP sent to email" });

  } catch (err) {
    console.log("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------
// RESET PASSWORD
// ---------------------------
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  try {
    const result = await db.query(
      `SELECT * FROM users 
       WHERE LOWER(email) = $1 
       AND reset_otp = $2 
       AND reset_otp_expiry > NOW()`,
      [normalizedEmail, otp]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      `UPDATE users 
       SET password = $1, reset_otp = NULL, reset_otp_expiry = NULL 
       WHERE LOWER(email) = $2`,
      [hashedPassword, normalizedEmail]
    );

    res.json({ message: "Password reset successful" });

  } catch (err) {
    console.log("Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  verifyOtp,
  login,
  logout,
  forgotPassword,
  resetPassword,
};