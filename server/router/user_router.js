const {userController} = require('../controller/user_controller');
const router = require("express").Router();

//Endpoint
router.get("/getAll", userController.getAllUser);
router.post('/login', (req, res, next) => {
    req.withCredentials = true;
    next();
  }, userController.login);
router.post("/register", userController.register);
router.post("/logout", userController.logout);
router.delete("/removeUser/:userId", userController.deleteUser);
router.get("/getUserInfo/:UserId", userController.getUserInfo);
router.put("/editUserInfo/:UserId", userController.editUserInfo);

module.exports = router;