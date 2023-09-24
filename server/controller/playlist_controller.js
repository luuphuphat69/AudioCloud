const Playlist = require('../model/playlist');
const jwt = require('jsonwebtoken');

const PlaylistController = {
    getPlaylists: async(req, res) =>{
        try{
            const Playlists = await Playlist.find();
            res.status(200).json(Playlists);
        }catch(error){
            console.log(error);
        }
    },
    getPlaylistInfo: async(req, res) => {
        try{
            const playlistId = req.params.PlaylistId;
            const filter = {PlaylistId: playlistId};
            const playlist = await Playlist.findOne(filter);
            res.status(200).json(playlist);
        }catch(error){
            console.log(error);
            res.status(500).json({message: "Server error"});
        }
    },
    postPlaylist: async(req, res) => {
        try{
            const token = req.cookies.token;
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const userId = decodedToken.userId;
        
            const {Title, Genre, IsPublic} = req.body;
            const playlist = new Playlist({
                PlaylistId: generatePlaylistId(),
                UserId: userId,
                Title: Title,
                Genre: Genre,
                IsPublic: IsPublic
            });
            await playlist.save();
            res.status(201).json({message: "Create playlist succesfull"});
        }catch(error){
            console.log(error);
            res.status(500).json({ message: 'Server error' });
        }
    },
    removePlaylist: async(req, res) =>{
        try{
            const playlistId = req.params.PlaylistId;
            const filter = {PlaylistId: playlistId};
            const playlist = await Playlist.findOne(filter);
            if(!playlist){
                return res.status(400).json({message: "Bad request. Playlist not found"});
            }
            await Playlist.findOneAndDelete(playlist);
            res.status(201).json({message: "Delete successfull"});
        }catch(err){
            console.log(err);
            res.status(500).json({message: "Server error"});
        }
    }
}
function generatePlaylistId() {
    // Generate an 8-digit random number
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
  
    // Concatenate the random number with 'UID' prefix
    const playlistId = `PLAYLIST${randomNumber}`;
  
    return playlistId;
  }
module.exports = PlaylistController;