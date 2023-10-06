const audioController = require("../controller/audio_controller");
const router = require("express").Router();
const multer = require('multer');

const upload = multer({ dest: 'temp/' }); // Specify a temporary upload directory

router.post("/postAudio", upload.fields([{ name: 'Audio', maxCount: 1 }, { name: 'Photo', maxCount: 1 }]), audioController.postAudio);
router.put("/add/:audioId/:playlistId", audioController.addToPlaylist);
router.delete("/removeAudio/:audioId", audioController.removeAudio);
router.get("/getAudios", audioController.getAllAudio);
router.get("/getTop50/:type", audioController.getTop50);
router.get("/getTop100", audioController.getTop100);
router.get("/search", audioController.search);

router.get("/getAudioInfo/:audioId", audioController.getAudioInfo);
module.exports = router;