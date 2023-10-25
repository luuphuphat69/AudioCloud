const commentController = require('../controller/comment_controller');
const router = require("express").Router();

router.post('/post', commentController.postComment);
router.get('/get-comments/:audioId', commentController.getComments);

module.exports = router;