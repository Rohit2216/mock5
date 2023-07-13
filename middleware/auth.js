const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Access denied. Token not provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.userToken);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token." });
  }
};

module.exports = {
  authMiddleware
};
