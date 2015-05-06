var Comment = require('../models/comment');
var User = require('../models/user');
exports.commentSubmit = function(req, res, next) {
	var _comment = req.body.comment;
	var user = req.session.user;
	if(!user){
		return res.json({iRet : 1, sMsg : "您还没有登录，请登录后再评论！"});
	}
	var newComment = new Comment(_comment);
	newComment.save(function(err, comment) {
		if(comment){
			var userId = comment.from;
			User.findById(userId, function(err, user) {
				return res.json({iRet : 0, sMsg : "评论成功", oComment : comment, from : user.name});
			})
			
		}else{
			return res.json({iRet : -1, sMsg : "系统繁忙，请稍后再试"});
		}
	})
}