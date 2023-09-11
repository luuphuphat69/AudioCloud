const customerController = require("../controller/customer_controller");
const router = require("express").Router();
const jwt = require("jsonwebtoken")
const multer = require('multer');

const upload = multer({ dest: 'temp/' }); // Specify a temporary upload directory


// Middleware to verify JWT tokens
function authenticateJWT(req, res, next) {
    const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Token expired or invalid' });
      }
  
      req.user = user; // Attach user info to the request object
      next();
    });
  }

router.post("/add", authenticateJWT, customerController.addCustomer);
router.post("/login", customerController.customerLogin);
router.get("/", customerController.allCustomer);

module.exports = router;