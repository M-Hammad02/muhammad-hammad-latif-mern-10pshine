const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const  User  = require('../models/User');

// register the user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    req.log.info({ userId: user.id }, 'User registered');
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// login the user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    req.log.info({ userId: user.id }, 'User logged in');
    res.json({ token });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'avatar', 'bio'], // ✅ include these
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// update user profile
exports.updateProfile = async (req, res) => {
  try {
    console.log("🟢 Update profile body:", req.body);
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, avatar, bio } = req.body;
    console.log("🟢 Before update:", { name, email, avatar: avatar?.slice(0, 30), bio });

    if (name) user.name = name;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;
    if (bio) user.bio = bio;

    await user.save();

    res.json({
      message: "Profile updated",
      user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, bio: user.bio },
    });
  } catch (err) {
    console.error("🔴 updateProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// change password
exports.changePassword = async (req, res) => {
  try {
    console.log("🟢 Change password body:", req.body);
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    console.log("🟢 Password match:", isMatch);

    if (!isMatch)
      return res.status(400).json({ message: "Incorrect current password" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("🔴 changePassword error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
