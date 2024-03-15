const CommentRepost = require("./CommentRepos");
const Comment = require("../../model/comment");

class CommentReposConcrete extends CommentRepost{
    createComment(commentData){
        try {
            const comment = new Comment(commentData);
            comment.save();
            return comment;
        } catch (error) {
            console.log(error);
        }
    }
    findCommentByAudioId(audioId){
        try {
            const comments =  Comment.find({ AudioId: audioId }).sort({ DateComment: -1 });
            return comments;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = CommentReposConcrete;