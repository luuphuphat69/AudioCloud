const router = require("express").Router();
const PlaylistController = require('../controller/playlist_controller');

router.get("/getAll", PlaylistController.getPlaylists);
router.get("/getInfo/:PlaylistId", PlaylistController.getPlaylistInfo);
router.get("/get-user-playlist/:UserId", PlaylistController.getUserPlaylist);
router.put("/add-to-playlist/:audioId/:playlistId", PlaylistController.addToPlaylist);
router.post("/create/:UserId", PlaylistController.createPlaylist);
router.delete("/delete/:PlaylistId", PlaylistController.removePlaylist);
module.exports = router;