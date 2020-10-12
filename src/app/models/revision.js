var mongoose = require('./db');

var RevisionSchema = new mongoose.Schema(
		{
			title: String, 
			timestamp:Date, 
			user:String, 
			anon:Boolean,
			admin:Boolean,
			bot:Boolean
		},
		 {
		 	versionKey: false
		})
//get the last n revisions of an article
RevisionSchema.statics.findTitleLatestRevs = function(title, limit, callback) {
	return this.find({'title':title})
	.sort({'timestamp':-1})
	.limit(limit)
	.exec(callback)
}
//get all different articles and the number of revisions
RevisionSchema.statics.getAllArticles = function(callback) {	
	return this.aggregate([
		{$group:{_id:"$title", numOfEdits:{$sum:1}}},
		{$sort:{_id:1}}
		])
	.exec(callback)	
}
//get the number of revisions for an article at given time period
RevisionSchema.statics.findTitleRevisionNumber = function(title,from,to, callback) {
	var a=from.toString();
	var b=(parseInt(to)+1).toString();
		
	return this.find({title:title,timestamp:{$gte: new Date(a), $lt:new Date(b)}}).count().exec(callback);	
}
//find the top5 authors for an article
RevisionSchema.statics.findTopAuthors = function(title, from,to,callback) {
	var a=from.toString();
	var b=(parseInt(to)+1).toString();

	return this.aggregate([ {$match:{title:title,anon:{$ne:true},admin:{$ne:true},bot:{$ne:true},timestamp:{$gte: new Date(a), $lt:new Date(b)}}}, 

		{$group:{_id:"$user", numOfEdits: {$sum:1}}}, {$sort:{numOfEdits:-1}},
		{$limit:5} ]).exec(callback);
}

//-------------------------------Graph1---------------------------
RevisionSchema.statics.getRevisionsRegular = function(title,from,to, callback) {
	var a=from.toString();
	var b=(parseInt(to)+1).toString();
		return this.aggregate([  {$match:{title:title,anon:{$ne:true},admin:{$ne:true},bot:{$ne:true}
		,timestamp:{$gte: new Date(a), $lt:new Date(b)}}},
		{$group:{_id:"$title", numOfEdits: {$sum:1}}}, {$sort:{_id:1}} ])
		.exec(callback)
}

RevisionSchema.statics.getRevisionsAnon = function(title,from,to, callback) {
	var a=from.toString();
	var b=(parseInt(to)+1).toString();
	return this.aggregate([  {$match:{title:title,anon:true,timestamp:{$gte: new Date(a), $lt:new Date(b)}}},
		{$group:{_id:"$title", numOfEdits: {$sum:1}}}, {$sort:{_id:1}} ])
		.exec(callback)
}

RevisionSchema.statics.getRevisionsAdmin = function(title,from,to, callback) {
	var a=from.toString();
	var b=(parseInt(to)+1).toString();
	return this.aggregate([  {$match:{title:title,admin:true,timestamp:{$gte: new Date(a), $lt:new Date(b)}}},
		{$group:{_id:"$title", numOfEdits: {$sum:1}}}, {$sort:{_id:1}} ])
		.exec(callback)
}

RevisionSchema.statics.getRevisionsBot = function(title,from,to, callback) {
	var a=from.toString();
	var b=(parseInt(to)+1).toString();
	return this.aggregate([  {$match:{title:title,bot:true,timestamp:{$gte: new Date(a), $lt:new Date(b)}}},
		{$group:{_id:"$title", numOfEdits: {$sum:1}}}, {$sort:{_id:1}} ])
		.exec(callback)
}
//-------------------------------Graph1---------------------------

//----------------------------------------Graph2----------------------------
RevisionSchema.statics.getRevisionsByYearAnon = function(title,from,to, callback) {
	var a=from.toString();
	var b=(parseInt(to)+1).toString();
	return this.aggregate([  {$match:{title:title,anon:true,timestamp:{$gte: new Date(a), $lt:new Date(b)}}},
		{$group:{_id:{'$year':'$timestamp'}, numOfEdits: {$sum:1}}}, {$sort:{_id:1}} ])
		.exec(callback)
}

RevisionSchema.statics.getRevisionsByYearRegular = function(title,from,to, callback) {
	var a=from.toString();
	var b=(parseInt(to)+1).toString();
	return this.aggregate([  {$match:{title:title,anon:{$ne:true},admin:{$ne:true},bot:{$ne:true}
	,timestamp:{$gte: new Date(a), $lt:new Date(b)}}},
		{$group:{_id:{'$year':'$timestamp'}, numOfEdits: {$sum:1}}}, {$sort:{_id:1}} ])
		.exec(callback)	
}

RevisionSchema.statics.getRevisionsByYearAdmin = function(title,from,to, callback) {
	var a=from.toString();
	var b=(parseInt(to)+1).toString();
	return this.aggregate([  {$match:{title:title,admin:true,timestamp:{$gte: new Date(a), $lt:new Date(b)}}},
		{$group:{_id:{'$year':'$timestamp'}, numOfEdits: {$sum:1}}}, {$sort:{_id:1}} ])
		.exec(callback)
}

RevisionSchema.statics.getRevisionsByYearBot = function(title,from,to, callback) {
	var a=from.toString();
	var b=(parseInt(to)+1).toString();
	return this.aggregate([  {$match:{title:title,bot:true,timestamp:{$gte: new Date(a), $lt:new Date(b)}}},
		{$group:{_id:{'$year':'$timestamp'}, numOfEdits: {$sum:1}}}, {$sort:{_id:1}} ])
		.exec(callback)
}
//-------------------------------Graph2---------------------------
//get all revision articles for a user
RevisionSchema.statics.getRevisionedArticle = function(user, callback) {
	return this.aggregate([  {$match:{user:user}},
		{$group:{_id:"$title", numOfEdits: {$sum:1}}}, {$sort:{_id:1}} ])
		.exec(callback)
}
//get all revision timestamps for an article by a user
RevisionSchema.statics.getAllTimes = function(user, title, callback) {
	return this.aggregate([  {$match:{user:user,title:title}},
		{$group:{_id:"$timestamp", numOfEdits: {$sum:1}}}, {$sort:{_id:1}} ])
		.exec(callback)
}
//get all revisions based on years for an article by a user
RevisionSchema.statics.revisionsUserYear = function(user, title,from,to, callback) {
	var a=from.toString();
	var b=(parseInt(to)+1).toString();
	return this.aggregate([  {$match:{title:title,user:user,timestamp:{$gte: new Date(a), $lt:new Date(b)}}},
		{$group:{_id:{'$year':'$timestamp'}, numOfEdits: {$sum:1}}}, {$sort:{_id:1}} ])
		.exec(callback)
}
//get the last revision timestamp of an article
RevisionSchema.statics.getLast = function(title, callback) {	
	return this.find({title:title}).sort({timestamp:-1}).limit(1)
		.exec(callback)
}
//get all regular users
RevisionSchema.statics.getAllName = function(callback) {
	
	return this.distinct('user',{anon:{$ne:true},admin:{$ne:true},bot:{$ne:true}})
		.exec(callback)
}
/////---------------------------------------
//-----------------------overall part table informations-----------------
RevisionSchema.statics.findHighestNumberRevision = function(n,callback) {
	var HighestNumberRevision = [
		{ '$group': { '_id': "$title", 'countRivs': { $sum: 1 } } },
		{ '$sort': { countRivs: -1 } },
		{ '$limit': n }
	]
	return this.aggregate(HighestNumberRevision).exec(callback);
}

RevisionSchema.statics.findLowestNumberRevision = function(n,callback) {
	var LowestNumberRevision = [
		{ '$group': { '_id': "$title", 'countRivs': { $sum: 1 } } },
		{ '$sort': { countRivs: 1 } },
		{ '$limit': n }
	]
	return this.aggregate(LowestNumberRevision).exec(callback);
}

RevisionSchema.statics.findLongestHistory = function(n,callback) {
	var LongestHistory = [
		{ '$group': { '_id': { title: '$title' }, latestTime: { $max: '$timestamp' }, createTime: { $min: '$timestamp' } } },
		{ '$project': { '_id': '$_id.title', 'age': {$divide: [{ $subtract: [ '$latestTime', '$createTime' ] }, 86400000]} } },
		{ '$sort': { 'age': -1 } },
		{ '$limit': n }
	];
	return this.aggregate(LongestHistory).exec(callback);
}

RevisionSchema.statics.findShortestHistory = function(n,callback) {
	var ShortestHistory = [
		{ '$group': { '_id': { title: '$title' }, latestTime: { $max: '$timestamp' }, createTime: { $min: '$timestamp' } } },
		{ '$project': { '_id': '$_id.title', 'age': {$divide: [{ $subtract: [ '$latestTime', '$createTime' ] }, 86400000]} } },
		{ '$sort': { 'age': 1 } },
		{ '$limit': n }
	];
	return this.aggregate(ShortestHistory).exec(callback);
}
//-------------------------overall part table informations---------------------------

//--------------------------Bar/Line chart for overall part-------------------
RevisionSchema.statics.barAndLineRegular = function (callback) {
	return this.aggregate([  {$match:{anon:{$ne:true},admin:{$ne:true},bot:{$ne:true}}},
		{$group:{_id:{'$year':'$timestamp'}, numOfEdits: {$sum:1}}}, {$sort:{_id:1}} ])
		.exec(callback)
}

RevisionSchema.statics.barAndLineAnon = function (callback) {
	return this.aggregate([  {$match:{anon:true}},
		{$group:{_id:{'$year':'$timestamp'}, numOfEdits: {$sum:1}}}, {$sort:{_id:1}} ])
		.exec(callback)
}

RevisionSchema.statics.barAndLineAdmin = function (callback) {
	return this.aggregate([  {$match:{admin:true}},
		{$group:{_id:{'$year':'$timestamp'}, numOfEdits: {$sum:1}}}, {$sort:{_id:1}} ])
		.exec(callback)
}

RevisionSchema.statics.barAndLineBot = function (callback) {
	return this.aggregate([  {$match:{bot:true}},
		{$group:{_id:{'$year':'$timestamp'}, numOfEdits: {$sum:1}}}, {$sort:{_id:1}} ])
		.exec(callback)
}
//--------------------------Bar/Line chart for overall part-------------------
//----------------------overall pie-------------------
RevisionSchema.statics.pieRegular = function (callback) {
	return this.find({anon:{$ne:true},admin:{$ne:true},bot:{$ne:true}}).count()
		.exec(callback)
}

RevisionSchema.statics.pieAnon = function (callback) {
	return this.find({anon:true}).count()
		.exec(callback)
}

RevisionSchema.statics.pieAdmin = function (callback) {
	return this.find({admin:true}).count()
	
		.exec(callback)
}

RevisionSchema.statics.pieBot = function (callback) {
	return this.find({bot:true}).count()
		.exec(callback)
}

RevisionSchema.statics.pieTotal = function (callback) {
	return this.find().count()
		.exec(callback)
}
//----------------------overall pie-------------------

//overall part user group
RevisionSchema.statics.findLargestUserGroup = function(n,callback) {
	var LargestUserGroup = [
		{ '$match': { 'bot': {$ne:true}}},
        { '$group': { '_id': { title: '$title', user: '$user' } } },
        { '$group': { '_id': '$_id.title', 'count': { $sum: 1 } } },
        { '$sort': { 'count': -1 } },
        { '$limit': n }
	]
	return this.aggregate(LargestUserGroup).exec(callback);
}

RevisionSchema.statics.findSmallestUserGroup = function(n,callback) {
	var SmallestUserGroup = [
		{ '$match': { 'bot': {$ne:true}}},
        { '$group': { '_id': { title: '$title', user: '$user' } } },
        { '$group': { '_id': '$_id.title', 'count': { $sum: 1 } } },
        { '$sort': { 'count': 1 } },
        { '$limit': n }
	]
	return this.aggregate(SmallestUserGroup).exec(callback);
}

var Revision = mongoose.model('Revision', RevisionSchema, 'revisions');

module.exports = Revision;
