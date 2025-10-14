const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // { User }
exports.register = async (req, res) => {
const { name, email, password } = req.body;
const existing = await User.findOne({ where: { email } });
if (existing) return res.status(400).json({ message: 'Email already used' });
const hashed = await bcrypt.hash(password, 10);
const user = await User.create({ name, email, password: hashed });
const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn:
process.env.JWT_EXPIRES_IN });
res.status(201).json({ token, user: { id: user.id, email: user.email, name:
user.name } });
};
exports.login = async (req, res) => {
const { email, password } = req.body;
const user = await User.findOne({ where: { email } });
if (!user) return res.status(401).json({ message: 'Invalid credentials' });
const match = await bcrypt.compare(password, user.password);
if (!match) return res.status(401).json({ message: 'Invalid credentials' });
const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn:
process.env.JWT_EXPIRES_IN });
res.json({ token, user: { id: user.id, email: user.email, name:
user.name } });
};
