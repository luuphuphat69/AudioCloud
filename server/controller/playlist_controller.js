const Playlist = require('../model/playlist');
const Audio = require('../model/audio');
const PlaylistBuilder = require('../usage/builder/PlaylistBuilder');
const jwt = require('jsonwebtoken');

const PlaylistController = {
    getPlaylists: async (req, res) => {
        try {
            const Playlists = await Playlist.find();
            res.status(200).json(Playlists);
        } catch (error) {
            console.log(error);
        }
    },
    getPlaylistInfo: async (req, res) => {
        try {
            const playlistId = req.params.PlaylistId;
            const filter = { PlaylistId: playlistId };
            const playlist = await Playlist.findOne(filter);
            res.status(200).json(playlist);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Server error" });
        }
    },
    getUserPlaylist: async (req, res) => {
        try {
            const userId = req.params.UserId;
            const playlists = await Playlist.find({ UserId: userId });
            return res.status(201).json(playlists);
        } catch (error) {
            console.log(error);
        }
    },
    addToPlaylist: async (req, res) => {
        try {
            const audioId = req.params.audioId;
            const playlistId = req.params.playlistId;
            const audio = await Audio.findOne({ AudioId: audioId });
            const playlist = await Playlist.findOne({ PlaylistId: playlistId })
            const existingAudioIndex = playlist.ListAudio.findIndex(a => a.AudioId === audioId);
            if (existingAudioIndex !== -1) {
                // If the audio exists, replace it
                playlist.ListAudio[existingAudioIndex] = audio;
            } else {
                // If the audio doesn't exist, add it to the list
                playlist.ListAudio.push(audio);
            }
            await playlist.save();
        } catch (err) {
            console.log(err);
        }
    },
    createPlaylist: async (req, res) => {
        try {
            const userId = req.params.UserId;
            const { title, genre, isPublic } = req.body;
            const playlistId = generatePlaylistId();

            const existPlaylist = await Playlist.findOne({ Title: title, UserId: userId });
            if (existPlaylist) {
                return res.status(400).json({ message: "Playlist is existed" });
            }
            
            const playlistBuilder = new PlaylistBuilder();
            playlistBuilder.playlistBuilder(playlistId, userId, title, isPublic)
            playlistBuilder.playlistWithGenre(genre);
            playlistBuilder.playlistWithListAudio([]);
            
            const playlist = playlistBuilder.build();
            await playlist.save();

            res.status(201).json({ message: "Create playlist succesfull" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Server error' });
        }
    },
    removePlaylist: async (req, res) => {
        try {
            const playlistId = req.params.PlaylistId;
            const filter = { PlaylistId: playlistId };
            const playlist = await Playlist.findOne(filter);
            if (!playlist) {
                return res.status(400).json({ message: "Bad request. Playlist not found" });
            }
            await Playlist.findOneAndDelete(filter); // Use the 'filter' object
            res.status(201).json({ message: "Delete successful" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Server error" });
        }
    },
    editPlaylist: async (req, res) => {
        try {
            const { title, genre, isPublic } = req.body;
            const playlistId = req.params.PlaylistId;

            // Check if the playlist with the given ID exists
            const playlist = await Playlist.findOne({ PlaylistId: playlistId });

            if (!playlist) {
                return res.status(404).json({ message: "Playlist not found" });
            }

            // Update the playlist properties
            if (title) {
                playlist.Title = title;
            }
            if (genre) {
                playlist.Genre = genre;
            }
            playlist.IsPublic = isPublic;

            // Save the updated playlist
            await playlist.save();

            return res.status(200).json({ message: "Playlist updated successfully" });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Server error" });
        }
    },
    removeAudio: async (req, res) => {
        try{
            const audioId = req.params.AudioId;
            const playlistId = req.params.PlaylistId;
            
            const playlist = await Playlist.findOne({ PlaylistId: playlistId });
            playlist.ListAudio = playlist.ListAudio.filter(audio => audio.AudioId !== audioId);
    
            await playlist.save();
            return res.status(200).json({message: "Remove successfully"});
        }catch(error){
            console.log(error);
        }
    },
    search: async (req, res) => {
        try {
          const filter = req.query.queries;
          const playlist = await Playlist.find({
            IsPublic: true,
            $or: [
              { Title: { $regex: filter, $options: 'i' } },
            ],
          });
          res.status(200).json(playlist);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Server error" });
        }
      },
}
function generatePlaylistId() {
    // Generate an 8-digit random number
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000);

    // Concatenate the random number with 'UID' prefix
    const playlistId = `PLAYLIST${randomNumber}`;

    return playlistId;
}
module.exports = PlaylistController;