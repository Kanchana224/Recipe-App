const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  console.log("Received Token:", token); // Log the received token
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token Verification Error:", error); // Log token verification error
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = verifyToken;