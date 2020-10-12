var mongoose = require('./db')

var AdminSchema = new mongoose.Schema(
	{
		name: String
	})


var AdminData = mongoose.model('AdminData', AdminSchema, 'administrators')

module.exports = AdminData