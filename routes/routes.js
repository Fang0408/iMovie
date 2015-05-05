var movie = require('../controllers/movie');
var user = require('../controllers/user');
var comment = require('../controllers/comment');
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
	app.get('/admin', movie.adminMovieList);
	app.get('/admin/list', movie.adminMovieList);

	//新增影片路由
	app.get('/admin/movie', movie.addMoviePage);
	//编辑影片路由
	app.get('/admin/update/:id', movie.editMoviePage);
	app.get('/error',function(req,res){
		res.render('error',{
			title : '出错啦'
		})
	})
	//通过post删除电影
	app.post('/admin/movie/delete', movie.deleteMovie);
	//新增电影or根据id编辑影片
	app.post('/admin/movie/new', movie.addMovie);

	//登录路由
	app.get('/login', user.loginPage);
	//注册路由
	app.get('/register', user.registerPage);
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

	//通过post提交电影评论
	app.post('/comment/submit', comment.commentSubmit);
}

module.exports = routes;