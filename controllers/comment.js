var Comment = require('../models/comment');

exports.commentSubmit = function(req, res, next) {
	var _comment = req.body.comment;
	var user = req.session.user;
	if(!user){
		return res.json({iRet : 1, sMsg : "您还没有登录，请登录后再评论"});
	}
	var newComment = new Comment(_comment);
	newComment.save(function(err, comment) {
		console.log(comment);
	})
}