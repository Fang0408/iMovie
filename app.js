var express = require('express');
var port = process.env.PORT || 3000;
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var multipart = require('connect-multiparty');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var moment = require('moment');
var routes = require('./routes/routes');
var Movie = require('./models/movie');
var User = require('./models/user');
var underscore = require('underscore');
var log4js = require('log4js');
var app = express();

var DB_URL = 'mongodb://localhost/imovie';
mongoose.connect(DB_URL);

app.set('views','./views/pages');
app.set('view engine','jade');
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());
app.use(session({
	secret : 'iMovie',
	store : new mongoStore({
		url : DB_URL,
		collections : 'sessions'
	})
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multipart());
app.locals.pretty = true;

log4js.configure({
	appenders : [
		{
			type : 'console'
		},
		{
			type : 'file',
			filename : './logs/app.log',
			maxLogSIze : 2048,
			backups : 3,
			category : 'normal'
		}
	]
});
var logger = log4js.getLogger('normal', {
	level : 'auto'
});
logger.setLevel('INFO');
app.use(log4js.connectLogger(logger));

routes(app);
http.createServer(app).listen(3000);
