const userController = require('../controller/user_controller');
const router = require("express").Router();

router.get("/getAll", userController.getAllUser);
router.post("/login", userController.login);
module.exports = router;