const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sequelize } = require("../models");
const { sendResetEmail } = require("../services/emailService");
const Sequelize = require("sequelize");
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const Folder = require('../models/Folder');

// register 
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already used' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    await Folder.bulkCreate([
      { name: "Personal", userId: user.id },
      { name: "Work", userId: user.id },
    ]);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // ✅ Return full user object (including avatar, bio)
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// login 
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // ✅ Return full user info
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
        const [user] = await sequelize.query(
            "SELECT * FROM users WHERE email = ?",
            { replacements: [email] }
        );

    if (!user.length)
      return res.status(404).json({ ok: false, message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await sequelize.query(
      "UPDATE users SET reset_token = ?, reset_expires = ? WHERE email = ?",
      { replacements: [token, expires, email] }
    );

    const link = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await sendResetEmail(email, link);

    res.json({ ok: true, message: "Reset link sent to email" });
  } catch (err) {
    console.error("Forgot Password Error:", err); 
    res.status(500).json({ ok: false, message: "Server error" });
  }
};
// Reset Password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const [user] = await sequelize.query(
        "SELECT * FROM users WHERE reset_token = ? AND reset_expires > NOW()",
        { replacements: [token] }
        );
    if (!user.length)
      return res.status(400).json({ ok: false, message: "Invalid or expired token" });

    const hashed = await bcrypt.hash(password, 10);
    await sequelize.query(
      "UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?",
      { replacements: [hashed, user[0].id] }
    );

    res.json({ ok: true, message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
};