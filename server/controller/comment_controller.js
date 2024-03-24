const CommentReposConcrete = require('../usage/repository/CommentReposConcrete');
const commentRepo = new CommentReposConcrete();
const Comment = require('../model/comment');
const ConcreateCommentPrototype = require('../usage/prototype/ConcreateCommentPrototype');

const commentController = {
    postComment: async(req, res) => {
        try{
            const {audioId, commentContent, userId, userDisplayname, photoURL} = req.body;

            const currentDate = new Date();
            const formattedDate = formatDateTime(currentDate);
            let commentData = null;
            
            let findComment = await Comment.findOne({AudioId: audioId, UserId: userId, CommentContent: commentContent});
            if(findComment){
                const copyComment = new ConcreateCommentPrototype(findComment);
                const copied = copyComment.clone();
                console.log("copied", copied);
                commentData = {
                    CommentId: generateCommentId(),
                    CommentContent: copied._doc.CommentContent,
                    AudioId: copied._doc.AudioId,
                    UserId: copied._doc.UserId,
                    UserDisplayname: copied._doc.UserDisplayname,
                    PhotoURL: copied._doc.PhotoURL,
                    DateComment: formattedDate,
                };                
                console.log("commentData", commentData);
            }else{
                commentData ={
                    CommentId: generateCommentId(),
                    CommentContent: commentContent,
                    AudioId: audioId,
                    UserId: userId,
                    UserDisplayname: userDisplayname,
                    PhotoURL: photoURL,
                    DateComment:formattedDate,
                };
            }
            const comment = await commentRepo.createComment(commentData);
            return res.status(201).json({message: "Posted comment: ", comment});
        }catch(err){
            console.log(err);
            return res.status(500).json({message: "Server error"});
        }
    },
    getComments: async(req, res) => {
        try{
            const audioId = req.params.audioId;
            const comments = await commentRepo.findCommentByAudioId(audioId);
            return res.status(200).json(comments);
        }catch(err){
            console.log(err);
            return res.status(500).json({message: err});
        }
    },
}
const formatDateTime = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};
function generateCommentId() {
    // Generate an 8-digit random number
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
  
    // Concatenate the random number with 'UID' prefix
    const commentId = `COMMENT${randomNumber}`;
  
    return commentId;
}
module.exports = commentController;