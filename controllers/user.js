var User = require('../models/user');
exports.checkUserSession = function(req, res, next) {
	var user = req.session.user;
	if(!user){
		return res.redirect('/login');
	}
	next();
}
exports.isSuperAdmin = function(req, res, next) {
	var user = req.session.user;
	var level = user.level;
	if(level >= 0){
		next();
	}
}

exports.updateLoginDate = function(req, res, next) {
	var user = req.session.user;
	if(!user){
		return res.redirect('/login');
	}
	user.updateValue(user._id, meta.lastLoginAt, Date.now(), function() {
		console.log(1);
	})
}