const jwt = require("jsonwebtoken");

module.exports = function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded token:", decoded); // 👈 Add this line
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Token error:", err.message);
    return res.status(403).json({ message: "Invalid token" });
  }
};
