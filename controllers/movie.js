var Movie = require('../models/movie');
var Comment = require('../models/comment');
var underscore = require('underscore');
var fs = require('fs');
var path = require('path');
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
			Comment.findByMovieId(id, function(err, comments) {
				console.log(comments)
				res.render('detail', {
					title : movie.name,
					movie : movie,
					comments : comments
				})
			})
			/*res.render('detail', {
				title : movie.name + '详情',
				movie : movie,
				comments : movieComments
			})*/
		}else{
			res.render('error', {
				status : 404
			})
		}
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
	}else{
		return res.redirect('/error');
	}
}
//上传电影海报
exports.uploadPoster = function(req, res, next) {
	var upload = req.files.posterImg;
	var filePath = upload.path;
	var originalName = upload.originalFilename;

	fs.readFile(filePath, function(err, data) {
		var timestamp = Date.now();
		var fileType = upload.type.split('/')[1];

		var newPath = path.join(__dirname, '../', 'public/uploads/posters/', timestamp+'.'+fileType);
		fs.writeFile(newPath, data, function(err) {
			console.log('done');
		})
	})
}
//新增电影记录或者修改相应id的电影记录
exports.addMovie = function(req, res, next){
	var _movie = req.body.movie;
	var _id = req.body.movie._id;
	if(_id !== 'undefined'){
		//页面传入movie._id
		Movie.findById(_id, function(err, movie) {
			if(err){
				return res.redirect('/error');
			}
			if(movie){
				var newMovie = underscore.extend(movie, _movie);
				newMovie.save(function(err, movie) {
					if(err){
						return res.redirect('/error');
					}
					if(movie){
						return res.redirect('/movie/'+movie._id);
					}
					return res.redirect('/error');
				})
			}else{
				return res.redirect('/error');
			}
			
		})
	}else{
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
}
exports.addMoviePage = function(req, res, next) {
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
}
exports.editMoviePage = function(req, res, next) {
	var id = req.params.id;
	if(id !== 'undefined'){
		Movie.findById(id, function(err, movie) {
			if(err){
				console.log(err);
				return res.redirect('/error');
			}
			if(movie){
				res.render('new',{
					title : movie.name + ' 编辑',
					movie : movie
				})
			}else{
				return res.redirect('/error');
			}
		})
	}else{
		res.redirect('/error');
	}
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