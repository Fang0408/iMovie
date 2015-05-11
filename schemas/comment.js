var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var CommentSchema = new Schema({
	user : {
		type : ObjectId,
		ref : 'User'
	},
	movie : {
		type : ObjectId,
		ref : 'Movie'
	},
	to : {
		type : ObjectId,
		ref : 'Comment'
	},
	reply : [{
		type : ObjectId,
		ref : 'Comment'
	}],
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
		return this.find({movie : id}).populate('user','name avatar').populate('movie','name').exec(cb);
	},
	findById : function(id, cb) {
		return this.findOne({_id : id}).exec(cb);
	},
	getById : function(id) {
		return this.findOne({_id : id});
	},
	getCommentsByMovieId : function(id, cb) {
		return this.find({movie : id}).populate('user','name avatar').populate('movie','name').exec(cb);
	}
}

module.exports = CommentSchema;