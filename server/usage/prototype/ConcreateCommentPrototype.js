const CommentPrototype = require('../prototype/CommentPrototype');
class ConcreateCommentPrototype extends CommentPrototype{
    
    constructor(comment){
        super();
        this.comment = comment;
    }
    clone(){
        const copied = structuredClone(this.comment);
        return copied;
    }
}
module.exports = ConcreateCommentPrototype;