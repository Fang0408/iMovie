var User = require('../models/user');
var url = require('url');
var path = require('path');
exports.checkUserSession = function(req, res, next) {
	var user = req.session.user;
	var redirectUrl = encodeURIComponent(req.url);
	if(!user){
		return res.redirect('/login?redirectUrl='+redirectUrl);
	}
	var lastLoginAt = new Date(user.meta.lastLoginAt);
	User.updateValue(user._id, {'meta.lastLoginAt': Date.now()}, function() {
		//console.log('update success.');
	})
	next();
}
exports.isSuperAdmin = function(req, res, next) {
	var user = req.session.user;
	var level = user.level;
	if(level >= 0){
		next();
	}
}
exports.ajaxCheckLogin = function(req, res, next) {
	var _user = req.body.user;
	if(!_user.email || !_user.password){
		return res.json({"iRet" : 1, "sMsg" : "请完整输入邮箱和密码"});
	}
	User.findByEmail(_user.email, function(err, user) {
		if(err){
			return res.json({"iRet" : -1, "sMsg" : "系统繁忙，请稍后再试"});
			
		}
		if(!user){
			return res.json({"iRet" : 2, "sMsg" : "邮箱或密码输入错误"});
			
		}
		user.comparePassword(_user.password, function(err, isMatch) {
			if(err){
				return res.json({"iRet" : -1, "sMsg" : "系统繁忙，请稍后再试"});
			}
			if(!isMatch){
				return res.json({"iRet" : 2, "sMsg" : "邮箱或密码输入错误"});
			}
			return res.json({"iRet" : 0, "sMsg" : "邮箱和密码匹配"});
		})
	})
}
exports.ajaxCheckRegister = function(req, res, next) {
	var _user = req.body.user;
	if(!_user.email || !_user.password || !_user.name){
		return res.json({"iRet" : 1, "sMsg" : "请完整输入邮箱、用户名和密码"});
	}
	User.findByEmail(_user.email, function(err, user) {
		if(err){
			return res.json({"iRet" : -1, "sMsg" : "系统繁忙，请稍后再试"});
		}
		if(user){
			return res.json({"iRet" : 2, "sMsg" : "该邮箱已注册过"});
		}
		return res.json({"iRet" : 0, "sMsg" : "该邮箱可用"})
	});
}
exports.userRegister = function(req, res, next) {
	var _user = req.body.user;
	if(!_user.name || !_user.email || !_user.password || _user.password !== _user.passwordConfirm){
		return res.redirect('/error');
	}
	var userObj = new User(_user);
	userObj.save(function(err, user) {
		if(err){
			console.log(err);
		}
		if(user){
			return res.redirect('/');
		}
	})
}
exports.userLogin = function(req, res, next) {
	var _user = req.body.user;
	var _redirectUrl = req.body.redirectUrl;
	if(!_user.email || !_user.password){
		return res.redirect('/error');
	}
	User.findByEmail(_user.email, function(err, user) {
		if(!user){
			return res.redirect('/error');
		}
		user.comparePassword(_user.password, function(err, isMatch) {
			if(err){
				console.log(err)
				console.log(111);
			}
			if(isMatch){
				req.session.user = user;
				console.log(user);
				if(_redirectUrl !== 'undefined' && _redirectUrl != ''){
					return res.redirect(decodeURIComponent(_redirectUrl));
				}else{
					return res.redirect('/');
				}
			}
			return res.redirect('/error');
		})
	})
}
exports.userLogout = function(req, res, next) {
	delete req.session.user;
	return res.redirect('/');
}
exports.loginPage = function(req, res, next) {
	if(req.session.user){
		return res.redirect('/');
	}
	return res.render('login', {
		title : '登录',
	});
}
exports.registerPage = function(req, res, next) {
	if(req.session.user){
		return res.redirect('/');
	}
	return res.render('register', {
		title : '注册'
	});
}
