var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CategorySchema = new Schema({
	name : String,
	movies : [{
		type : ObjectId,
		ref : 'Movie'
	}],
	createAt : {
		type : Date,
		default : Date.now()
	}
})

