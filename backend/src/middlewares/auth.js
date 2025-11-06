const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("🟡 Incoming auth header:", authHeader); 

  if (!authHeader) return res.status(401).json({ message: 'No token' });

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🟢 Token payload:", payload); 
    const user = await User.findByPk(payload.id);
    if (!user) return res.status(401).json({ message: 'Invalid token' });

    req.user = user;
    console.log("✅ Authenticated user:", user.email); 
    next();
  } catch (err) {
    console.error("🔴 Auth failed:", err.message); 
    return res.status(401).json({ message: 'Authentication failed' });
  }
};
