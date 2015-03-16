var express = require('express');
var port = process.env.PORT || 3000;
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var Movie = require('./models/movie')
var app = express();

mongoose.connect('mongodb://localhost/imovie')

app.set('views','./views/pages');
app.set('view engine','jade');
app.use(express.static(path.join(__dirname,'public')));

app.use(bodyParser.urlencoded({ extended: true }))  
app.use(bodyParser.json())  

app.get('/',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('index',{
			title : 'Home Page',
			movies : movies
		});
	});
	// res.render('index',{
	// 	title : 'Home Page',
	// 	movies : movies
	// });
});

app.get('/movie/:id',function(req,res){
	var id = req.params.id
	Movie.findById(id,function(err,movie){
		res.render('detail',{
			title : 'Detail Page'
			movie : movie
		});
	})
	
});

app.get('/admin/list',function(req,res){
	res.render('list',{
		title : 'List Page'
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
		title : 'New Page',
		movie : movie
	});
});
app.post('/admin/movie/new',function(req,res){
	var movie = req.body.movie;
	var _movie;
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
			console.log(err)
		}
		//res.redirect('/movie/'+movie.id)
	});
})
http.createServer(app).listen(3000);
//http.listen(port);