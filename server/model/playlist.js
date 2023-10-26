const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
    PlaylistId:{
        type: String,
        require:true,
    },
    UserId:{
        type:String,
        require: true,
    },
    Title:{
        type:String,
        require: true,
    },
    Genre:{
        type:String,
        require:true,
    },
    IsPublic:{
        type:Boolean,
        require: true,
    },
    ListAudio:{
        type:Array,
        require: false,
    }
});
const Playlist = mongoose.model("Playlist", PlaylistSchema, "Playlist");
module.exports = Playlist;