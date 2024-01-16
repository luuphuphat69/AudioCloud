const authMiddleware = (req, res, next) => {
  // Get the API key from the request header
  const apiKey = req.header('X-API-Key'); // Assuming API key is provided in the 'x-api-key' header

  // Check if the API key is present
  if (!apiKey) {
    return res.status(401).json({ message: 'Unauthorized - No API key provided' });
  }

  // Validate the API key (replace 'your_api_key' with your actual API key)
  if (apiKey.value === process.env.API_KEY) {
    next(); // Continue to the next middleware or route handler
  } else {
    res.status(401).json({ message: 'Unauthorized - Invalid API key' });
  }
};

module.exports = authMiddleware;