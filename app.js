var express = require('express');
var port = process.env.PORT || 3000;
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Movie = require('./models/movie');
var app = express();

mongoose.connect('mongodb://localhost/imovie')

app.set('views','./views/pages');
app.set('view engine','jade');
app.use(express.static(path.join(__dirname,'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
//电影详情页路由
app.get('/movie/:id',function(req,res){
	var id = req.params.id;
	Movie.findById(id,function(err,movie){
		res.render('detail',{
			title : movie.name + ' 详情',
			movie : movie
		});
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
				for(var i in movieObj){
					_movie[i] = movieObj[i]
				}
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
			doctor : movie.doctor,
			name : movie.name,
			language : movie.language,
			poster : movie.poster,
			flash : movie.flash,
			year : movie.year,
			country : movie.country,
			summary : movie.summary
		});
		_movie.save(function(err,movie){
			if(err){
				console.log(err);
			}
			res.redirect('/movie/'+movie._id);
		});
	}
	
})
http.createServer(app).listen(3000);