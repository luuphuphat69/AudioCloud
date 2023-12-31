const userController = require('../controller/user_controller');
const router = require("express").Router();
const multer = require('multer');

const upload = multer({ dest: 'temp/' }); // Specify a temporary upload directory

//Endpoint
router.get("/getAll", userController.getAllUser);
router.post('/login', (req, res, next) => {
    req.withCredentials = true;
    next();
  }, userController.login);
router.post("/register", userController.register);
router.post("/create-account", userController.createAccount);
router.post("/logout", userController.logout);
router.delete("/remove/:userId", userController.deleteUser);
router.get("/get-info/:UserId", userController.getUserInfo);
router.put("/edit/:UserId", upload.fields([{name: "UserPhoto", maxCount: 1}]), userController.editUserInfo);
router.put("/edit-user/:UserId", upload.fields([{name: "UserPhoto", maxCount: 1}]), userController.updateUserInfo); // Edit for admin
router.put("/update-pro/:UserId", userController.updatePro);
router.put("/update-artist/:UserId", userController.updateArtist);
router.get("/search-user", userController.searchUser);
module.exports = router;