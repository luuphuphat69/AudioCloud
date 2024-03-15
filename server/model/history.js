const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
    UserId:{
        type: String,
        require: true
    },
    ListAudio:{
        type: Array,
        require: true
    }
});

const History = mongoose.model("History", historySchema, "History");
module.exports = History;
