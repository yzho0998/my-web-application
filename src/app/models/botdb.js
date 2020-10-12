var mongoose = require('./db')

var BotSchema = new mongoose.Schema(
	{
		name: String
	})


var BotData = mongoose.model('BotData', BotSchema, 'bots')

module.exports = BotData