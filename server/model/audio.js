const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
    AudioName: {
        type: String,
        require: true
    },
    
    MIMEtype : {
        type: String,
        require: false
    },
    buffer   :{
        type: Buffer,
        require: false
    }
});
module.exports = mongoose.model("Audio", audioSchema, "Audio");