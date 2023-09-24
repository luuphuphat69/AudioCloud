const router = require("express").Router();
const PlaylistController = require('../controller/playlist_controller');

router.get("/getAll", PlaylistController.getPlaylists);
router.get("/getInfo/:PlaylistId", PlaylistController.getPlaylistInfo);
router.post("/create", PlaylistController.postPlaylist);
router.delete("/delete/:PlaylistId", PlaylistController.removePlaylist);
module.exports = router;