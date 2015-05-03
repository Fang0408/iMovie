var Movie = require('../models/movie');
var underscore = require('underscore');
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
	var id = req.body.id;
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
//admin电影列表页
exports.adminMovieList = function(req, res, next) {
	Movie.fetch(function(err, movies) {
		if(err){
			console.log(err);
		}
		res.render('list',{
			title : '列表',
			movies : movies
		});
		next();
	})
}
//根据id删除电影
exports.deleteMovie = function(req, res, next){
	var id = req.body.movieDelete;
	if(id){
		Movie.remove({_id : id},function(err,movie){
			if(err){
				return res.json({iRet : -1, sMsg : "系统繁忙，请稍后再试"});
			}
			if(movie){
				return res.json({iRet : 0, sMsg : "删除成功", deleteMovie : movie._id});
			}
			return res.json({iRet : 1, sMsg : "删除失败，电影不存在"});
		})
	}
	return res.redirect('/error');
}
//新增电影记录或者修改相应id的电影记录
exports.addMovie = function(req, res, next){
	var _movie = req.body.movie;
	var _id = req.body.movie._id;
	if(_id){
		//页面传入movie._id
		Movie.findById(_id, function(err, movie) {
			if(err){
				return res.redirect('/error');
			}
			if(movie){
				var newMovie = underscore.extend(movie, _movie);
				Movie.save(function(err, movie) {
					if(err){
						return res.redirect('/error');
					}
					if(movie){
						return res.redirect('/movie/'+movie._id);
					}
					return res.redirect('/error');
				})
			}
			return res.redirect('/error');
		})
	}
	//页面没有movie._id，视为新增电影记录
	var newMovie = new Movie({
		doctor : _movie.doctor,
		name : _movie.name,
		language : _movie.language,
		poster : _movie.poster,
		flash : _movie.flash,
		year : _movie.year,
		country : _movie.country,
		summary : _movie.summary
	});
	newMovie.save(function(err, movie) {
		if(err){
			return res.redirect('/error');
		}
		if(movie){
			return res.redirect('/movie/'+movie._id);
		}
		return res.redirect('/error');
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