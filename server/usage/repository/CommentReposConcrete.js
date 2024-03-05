const CommentRepost = require("./CommentRepos");
const Commnet = require("../../model/comment");

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
            return Comment.find({ AudioId: audioId }).sort({ DateComment: -1 });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = CommentReposConcrete;