const userController = require('../controller/user_controller');
const router = require("express").Router();

router.get("/getAll", userController.getAllUser);
router.post("/login", userController.login);
router.post("/register", userController.register);
router.delete("/removeUser/:userId", userController.deleteUser);
router.get("/getUserInfo", userController.getUserInfo);
router.post("/editUserInfo", userController.editUserInfo);

module.exports = router;