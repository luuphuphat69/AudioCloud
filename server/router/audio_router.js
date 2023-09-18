const audioController = require("../controller/audio_controller");
const router = require("express").Router();
const multer = require('multer');

const upload = multer({ dest: 'temp/' }); // Specify a temporary upload directory

router.post("/postAudio", upload.fields([{ name: 'Audio', maxCount: 1 }, { name: 'Photo', maxCount: 1 }]), audioController.postAudio);

module.exports = router;