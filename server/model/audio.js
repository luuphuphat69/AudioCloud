const mongoose = require("mongoose");

const audioSchema = new mongoose.Schema({
    AudioId: {
        type: String,
        require: true,
    },
    UserId:{
        type: String,
        require: true,
    },
    PhotoURL:{
        type:String,
        require: true,
    },
    AudioURL:{
        type: String,
        require: true,
    },
    Plays: {
        type: Number,
        require: true,
    },
    Genre:{
        type: String,
        require: true,
    },
    AudioName:{
        type: String,
        require: true,
    },
    IsPublic:{
        type: Boolean,
        require: true,
    },
    Description:{
        type: String,
        require: false,
    }
});
const Audio = mongoose.model("Audio", audioSchema, "Audio");
module.exports = Audio;