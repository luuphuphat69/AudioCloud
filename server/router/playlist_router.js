const router = require("express").Router();
const PlaylistController = require('../controller/playlist_controller');

router.get("/getAll", PlaylistController.getPlaylists);
router.get("/getInfo/:PlaylistId", PlaylistController.getPlaylistInfo);
router.get("/get-user-playlist/:UserId", PlaylistController.getUserPlaylist);
router.put("/add-to-playlist/:audioId/:playlistId", PlaylistController.addToPlaylist);
router.post("/create/:UserId", PlaylistController.createPlaylist);
router.put("/edit/:PlaylistId", PlaylistController.editPlaylist);
router.delete("/delete/:PlaylistId", PlaylistController.removePlaylist);
router.put("/remove-audio/:AudioId/:PlaylistId", PlaylistController.removeAudio);
router.get("/search", PlaylistController.search);
module.exports = router;