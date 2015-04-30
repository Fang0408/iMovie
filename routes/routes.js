var Movie = require('../models/Movie');
var User = require('../models/User');
var movie = require('../controllers/movie');
var user = require('../controllers/user');
var routes = function(app) {
	//把session存到locals里面
	app.use(function(req, res, next) {
		var user = req.session.user;
		app.locals.user = user;
		next();
	})
	//首页路由
	app.get('/', movie.list);
	//电影详情页路由
	app.get('/movie/:id', movie.detail);
	//admin下的路由都需要判断是否有session
	app.get(/^\/admin*/, user.checkUserSession, user.isSuperAdmin)
	
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
		if(req.session.user){
			res.redirect('/');
		}
		res.render('login',{
			title : '登录'
		})
	})
	app.get('/register',function(req, res) {
		if(req.session.user){
			res.redirect('/');
			return;
		}
		res.render('register',{
			title : '注册'
		})
	})
	
	//用户登录
	app.post('/login', user.userLogin);
	//ajax检查登录相关信息
	app.post('/login/checkLogin', user.ajaxCheckLogin);
	//ajax检查注册信息是否有重复
	app.post('/register/checkRegister', user.ajaxCheckRegister);
	//用户注册，添加记录
	app.post('/register', user.userRegister);
	//退出登录，清楚session
	app.get('/logout', user.userLogout);
}

module.exports = routes;