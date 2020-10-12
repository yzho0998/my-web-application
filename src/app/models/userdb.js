var mongoose = require('./db')

var UserSchema = new mongoose.Schema(
	{
		firstname: String,
		lastname: String,
		username: String,
		password: String,
		resetquestion: String,
		resetanswers: String
	})

UserSchema.statics.getDocument = function (username, callback) {
	return this.find({ 'username': username }).exec(callback)
}

var UserData = mongoose.model('UserData', UserSchema,'userdata')

module.exports = UserData