const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    CommentId:{
        type: String,
        require: true
    },
    AudioId:{
        type: String,
        require: true
    },
    CommentContent:{
        type: String,
        require: true
    },
    UserId:{
        type: String,
        require: true
    },
    UserDisplayname:{
        type: String,
        require: true
    },
    PhotoURL:{
        type: String,
        require: true
    },
    DateComment:{
        type: String,
        require:true
    }
});
const Comment = mongoose.model("Comment", commentSchema, "Comment");
module.exports = Comment;
