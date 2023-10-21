const Playlist = require('../model/playlist');
const Audio = require('../model/audio');
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
    getUserPlaylist: async(req, res) => {
        try{
            const userId = req.params.UserId;
            const playlists = await Playlist.find({UserId: userId});
            return res.status(201).json(playlists);
        }catch(error){
            console.log(error);
        }
    },
    addToPlaylist: async(req, res) => {
        try{
            const audioId = req.params.audioId;
            const playlistId = req.params.playlistId;
            const audio = await Audio.findOne({AudioId: audioId});
            const playlist = await Playlist.findOne({PlaylistId: playlistId})
            const existingAudioIndex = playlist.ListAudio.findIndex(a => a.AudioId === audioId);
            if (existingAudioIndex !== -1) {
                // If the audio exists, replace it
                playlist.ListAudio[existingAudioIndex] = audio;
            } else {
                // If the audio doesn't exist, add it to the list
                playlist.ListAudio.push(audio);
            }
            await playlist.save();
        }catch(err){
            console.log(err);
        }
    },
    createPlaylist: async(req, res) => {
        try{
            const userId = req.params.UserId;
            const {title, genre, isPublic} = req.body;
            const existPlaylist = await Playlist.findOne({Title: title, UserId: userId});
            if(existPlaylist){
                return res.status(400).json({message: "Playlist is existed"});
            }
            const playlist = new Playlist({
                PlaylistId: generatePlaylistId(),
                UserId: userId,
                Title: title,
                Genre: genre,
                IsPublic: isPublic
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