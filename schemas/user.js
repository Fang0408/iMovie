var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var SALT_WORK_FACTOR = 10;
var UserSchema = new mongoose.Schema({
	email : String,
	name : String,
	password : String,
	level : {
		type : Number,
		default : 0
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
	comparePassword : function(password,cb){
		bcrypt.compare(password,this.password,function(err,isMatch){
			if(err){
				console.log(err)
			}
			cb(null,isMatch);
		})
	}
}
UserSchema.statics = {
	fetch : function(cb){
		return this
			.find({}).sort('meta.updateAt')
			.exec(cb)
	},
	findById : function(id,cb){
		return this
			.findOne({_id:id})
			.exec(cb)
	},
	findByEmail : function(useremail,cb){
		return this
			.findOne({email:useremail})
			.exec(cb)
	}
}

module.exports = UserSchema