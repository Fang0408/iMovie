var Movie = require('../models/Movie');
var User = require('../models/User');
var routes = function(app) {
	//首页路由
	app.get('/',function(req,res){
		Movie.fetch(function(err,movies){
			if(err){
				console.log(err);
			}
			res.render('index',{
				title : '首页',
				movies : movies
			});
		});
	});
	app.get(/^\/admin*/,function(req,res,next){
		var user = app.locals.user;
		if(!user){
			return res.redirect('/login');
		}
		next()
	})
	//电影详情页路由
	app.get('/movie/:id',function(req,res){
		var id = req.params.id;
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}
			if(movie){
				res.render('detail',{
					title : movie.name + ' 详情',
					movie : movie
				});
			}else{
				res.redirect('/error')
				return
			}
			
		})
		
	});
	//管理端电影列表页路由
	app.get('/admin',function(req,res){
		Movie.fetch(function(err,movies){
			if(err){
				console.log(err);
			}
			res.render('list',{
				title : '列表',
				movies : movies
			});
		});
	});
	//管理端电影列表页路由
	app.get('/admin/list',function(req,res){
		Movie.fetch(function(err,movies){
			if(err){
				console.log(err);
			}
			res.render('list',{
				title : '列表',
				movies : movies
			});
		});
	});

	app.get('/admin/movie',function(req,res){
		var movie = {
			name : '',
			doctor : '',
			language : '',
			poster : '',
			flash : '',
			year : '',
			country : '',
			summary : ''
		}
		res.render('new',{
			title : '新增影片',
			movie : movie
		});
	});
	app.get('/admin/update/:id',function(req,res){
		var id = req.params.id;
		if(id){
			Movie.findById(id,function(err,movie){
				if(err){
					console.log(err)
					res.redirect('/error')
				}else{
					res.render('new',{
						title : movie.name + ' 编辑',
						movie : movie
					})
				}
				
			})
		}
	})
	app.get('/error',function(req,res){
		res.render('error',{
			title : '出错啦'
		})
	})
	app.delete('/admin/movie/delete',function(req,res){
		var id = req.query.id;
		if(id){
			Movie.remove({_id : id},function(err,movie){
				if(err){
					console.log(err);
					res.json({iRet : -1});
				}else{
					res.json({iRet : 0});
				}
			})
		}
		
	})
	app.post('/admin/movie/new',function(req,res){
		var id = req.body.movie._id;
		var movieObj = req.body.movie;
		var _movie;
		if(id !== 'undefined'){
			Movie.findById(id,function(err,movie){
				if(err){
					console.log(err)
				}else{
					_movie = underscore.extend(movie,movieObj)
					_movie.save(function(err,movie){
						if(err){
							console.log(err)
						}
						res.redirect('/movie/'+movie._id);
					});
				}
			})
		}else{
			_movie = new Movie({
				doctor : movieObj.doctor,
				name : movieObj.name,
				language : movieObj.language,
				poster : movieObj.poster,
				flash : movieObj.flash,
				year : movieObj.year,
				country : movieObj.country,
				summary : movieObj.summary
			});
			_movie.save(function(err,movie){
				if(err){
					console.log(err);
				}
				res.redirect('/movie/'+movie._id);
			});
		}
	})
	app.get('/login',function(req,res){
		res.render('login',{
			title : '登录'
		})
	})
	app.get('/register',function(req,res){
		res.render('register',{
			title : '注册'
		})
	})
	app.post('/login',function(req,res){
		var _user = req.body.user;
		if(_user.email && _user.password){
			User.findByEmail(_user.email,function(err,user){
				if(err){
					console.log(err)
					return
				}
				if(user){
					user.comparePassword(_user.password,function(err,isMatch){
						if(err){
							console.log(err)
						}
						if(isMatch){
							req.session.user = user;
							app.locals.user = user;
							res.cookie('username',user.name);
							res.redirect('/admin')
						}else{
							res.redirect('/')
						}
					})
				}else{
					res.redirect('/error')
				}
			});
		}
	})

	app.post('/login/checkLogin',function(req,res) {
		var _user = req.body.user;
		if(!_user.email || !_user.password){
			res.json({"iRet" : 1, "sMsg" : "请完整输入邮箱和密码"});
			return;
		}
		User.findByEmail(_user.email, function(err, user) {
			if(err){
				res.json({"iRet" : -1, "sMsg" : "系统繁忙，请稍后再试"});
				return;
			}
			if(!user){
				res.json({"iRet" : 2, "sMsg" : "邮箱或密码输入错误"});
				return;
			}
			user.comparePassword(_user.password, function(err, isMatch) {
				if(err){
					res.json({"iRet" : -1, "sMsg" : "系统繁忙，请稍后再试"});
					return;
				}
				if(!isMatch){
					res.json({"iRet" : 2, "sMsg" : "邮箱或密码输入错误"});
					return;
				}
				res.json({"iRet" : 0, "sMsg" : "邮箱和密码匹配"});
				return;
			})
		})
	})

	app.post('/register/checkRegister', function(req, res) {
		var _user = req.body.user;
		if(!_user.email || !_user.password || !_user.name){
			res.json({"iRet" : 1, "sMsg" : "请完整输入邮箱、用户名和密码"});
			return;
		}
		User.findByEmail(_user.email, function(err, user) {
			if(err){
				res.json({"iRet" : -1, "sMsg" : "系统繁忙，请稍后再试"});
				return;
			}
			if(user){
				res.json({"iRet" : 2, "sMsg" : "该邮箱已注册过"});
				return;
			}
			res.json({"iRet" : 0, "sMsg" : "该邮箱可用"})
			return;
		});
	})
	app.post('/register',function(req,res){
		var _user = req.body.user;
		if(!_user.email || !_user.password || !_user.name){
			return res.redirect('/error')
		}
		var userObj = new User(_user);
		userObj.save(function(err,user){
			if(err){
				console.log(err);
				return res.redirect('/error')
			}
			res.redirect('/admin')
		})
	})

	app.get('/logout',function(req,res){
		delete req.session.user;
		delete app.locals.user;
		res.redirect('/');
	})
}

module.exports = routes;