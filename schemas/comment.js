var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var CommentSchema = new Schema({
	movie : {
		type : ObjectId,
		ref : 'Movie'
	},
	from : {
		type : ObjectId,
		ref : 'User'
	},
	content : String,
	createAt : {
		type : Date,
		default : Date.now()
	}
})

CommentSchema.statics = {
	fetch : function(cb) {
		return this.find({}).sort(createAt).exec(cb);
	},
	findByMovieId : function(id, cb) {
		return this.find({movie : id}).sort('createAt').populate('from','name').exec(cb);
	}
}

module.exports = CommentSchema