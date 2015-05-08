var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var SALT_WORK_FACTOR = 10;
var UserSchema = new Schema({
	email : String,
	name : String,
	password : String,
	level : {
		type : Number,
		default : 0
	},
	avatar : {
		type : String,
		default : "/avatars/avatar-default-120.jpg"
	},
	meta : {
		createAt : {
			type : Date,
			default : Date.now()
		},
		updateAt : {
			type : Date,
			default : Date.now()
		},
		lastLoginAt : {
			type : Date,
			default : Date.now()
		}
	}
})

UserSchema.pre('save',function(next){
	var user = this;
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}

	bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
		if(err){
			return next(err);
		}
		bcrypt.hash(user.password,salt,function(err,hash){
			if(err){
				return next(err);
			}
			user.password = hash;
			next()
		})
	});
})
UserSchema.methods = {
	comparePassword : function(password,cb) {
		bcrypt.compare(password,this.password,function(err,isMatch){
			if(err){
				console.log(err)
			}
			cb(null,isMatch);
		})
	},
	updateValue : function(id, key, value, cb) {
		var options = {};
		var updates = {$set : {key : value}}
		this.update({_id : id}, updates, options, cb);
	}
}
UserSchema.statics = {
	fetch : function(cb) {
		return this
			.find({}).sort('meta.updateAt')
			.exec(cb)
	},
	findById : function(id, cb) {
		return this
			.findOne({_id:id})
			.exec(cb)
	},
	findByEmail : function(useremail, cb) {
		return this
			.findOne({email:useremail})
			.exec(cb)
	},
	updateValue : function(id, obj, cb) {
		var options = {};
		var updates = {$set : obj};
		return this.update({_id : id}, updates, options, cb);
	}
}

module.exports = UserSchema