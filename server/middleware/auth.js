// authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get the token from the request header
  const token = req.header('Authorization');

  // Check if token is present
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, 'audi0_stream_secret_key');

    // Attach the user information to the request for further processing
    req.user = decoded.user;
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

module.exports = authMiddleware;