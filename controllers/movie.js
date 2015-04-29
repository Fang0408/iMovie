var Movie = require('../models/movie');
//首页电影列表
exports.list = function(req, res, next) {
	Movie.fetch(function(err, movies) {
		if(err){
			console.log(err);
		}
		res.render('index', {
			title : "首页",
			movies : movies
		});
		next();
	})
}
//电影详情页
exports.detail = function(req, res, next) {
	var id = req.params.id;
	Movie.findById(id, function(err, movie) {
		if(err){
			console.log(err);
		}
		if(movie){
			res.render('detail', {
				title : movie.name + '详情',
				movie : movie
			})
		}else{
			res.render('error', {
				status : 404
			})
		}
		next();
	})
}
//获取电影集合，并把movies传到callback内然后执行
exports.moviesArray = function(callback) {
	Movie.fetch(function(err, movies) {
		if(err){
			console.log(err);
		}
		console.log(movies instanceof Array)
		callback(movies);
	})
}