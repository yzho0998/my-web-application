var Revision = require("../models/revision");
var path = require('path');
var fs=require('fs');
var fetch = require("node-fetch");
var passwordHash = require('password-hash');

var fs=require('fs');
var bots,admins;

var UserData = require("../models/userdb");
var tops;

var UserName;

fs.readFile(path.join(__dirname, '/bots.txt'),function(err,data){
	if(err){
		console.error(err);
	}
	else{
		bots=data.toString().split("\n")		
	}
});

fs.readFile(path.join(__dirname, '/administrators.txt'),function(err,data){
	if(err){
		console.error(err);
	}
	else{
		admins=data.toString().split("\n")	

	}
});
// -----------------------------------------------------
//check whether user is logining, and use session to control
module.exports.checkUser = function (req, res) {
	var Email = req.body.uname;
	var Password = req.body.psw;
	UserData.getDocument(Email, function (err, result) {
		if (err) {
			console.log("Error!")
		} 
		else {
			if (result == '') {
				console.log("You have to first have an account")
				res.render("sign_in_page.pug");
			}
			else {
				if (passwordHash.verify(Password, result[0].password)) {	            		            	   	                   	            		            	   
					UserName = Email;
					req.session.userName = Email;
					res.redirect('/logining');
				}
				else {	        		  
					res.render('login_page.pug');
				}
			}
		}
	});
}
//show the main page
module.exports.showMainPage = function (req, res) {

	if(req.session.userName) {  
		var val1=0;
		var val2=0;
		var val3=0;
		var val4=0;
		var userNum;
		var revision;
		//use promise to wait all callback 
		var a = function () {
			return new Promise(function (resolve, reject) {
				Revision.pieRegular(function(err, result) {
					if (err) {
						console.log("Cannot find ")
					}else {	
						if(result!=null) {
							val1 = result;
						}
					}
					resolve("a")
				})
			})
		}
		var b = function (data) {
			return new Promise(function (resolve, reject) {
				Revision.pieAnon(function(err, result){
					if (err) {
						console.log("Cannot find ")
					}else {		               						
						if(result!=null) {
							val2 = result;
						}
					}
					resolve(data+"b");
				})
			})
		}
		var c = function (data) {
			return new Promise(function (resolve, reject) {
				Revision.pieAdmin(function(err, result){
					if (err){
						console.log("Cannot find ")
					}else{		
						if(result!=null){
							val3 = result;
						}
					}
					resolve(data+"c");
				})
			})
		}
		var d = function (data) {
			return new Promise(function (resolve, reject) {
				Revision.pieBot(function(err, result){
					if (err){
						console.log("Cannot find ")
					}else{		
						if(result!=null){
							val4 = result;
						}
					}	
					resolve(data+"d");
				})
			})
		}
		var e = function (data) {
			return new Promise(function (resolve, reject) {
				Revision.getAllArticles(function(err, result){
					if (err){
						console.log("Cannot find ")
					}else{
						revision = result;
					}
					resolve(data+"e");
				})
			})
		}
		var f = function (data) {
			return new Promise(function (resolve, reject) {
				Revision.pieTotal(function(err, result){
					if (err){
						console.log("Cannot find ")
					}else{
						userNum = result;
					}
					resolve(data+"f");
				})
			})
		}
		var g = function (data) {
			return new Promise(function (resolve, reject) {

				var valFinal = new Array();
				valFinal[0] = new Array();
				valFinal[0][0] = "Regular";
				valFinal[0][1] = val1;
				valFinal[1] = new Array();
				valFinal[1][0] = "Anon";
				valFinal[1][1] = val2;
				valFinal[2] = new Array();
				valFinal[2][0] = "Admin";
				valFinal[2][1] = val3;
				valFinal[3] = new Array();
				valFinal[3][0] = "Bot";
				valFinal[3][1] = val4;

				res.render("mainPage.pug",{
					userNum:userNum,
					oneType:"regular",
					onePer:Math.round(val1*100/userNum),
					twoType:"anonymous",
					twoPer:Math.round(val2*100/userNum),
					threeType:"administrator",
					threePer:Math.round(val3*100/userNum),
					fourType:"bot",
					fourPer:Math.round(val4*100/userNum),
					revision:revision
				});
				resolve(data+"g");
			})
		}

		a()
		.then(function (data) {
			return b(data)
		})
		.then(function (data) {
			return c(data)
		})
		.then(function (data) {
			return d(data)
		})
		.then(function (data) {
			return e(data)
		})
		.then(function (data) {
			return f(data)
		})
		.then(function (data) {
			return g(data)
		})
	}
	else {

		res.render('login_page.pug');
	}
};

//overall information table for overall part
module.exports.getOverallTable=function(req,res){
	// Get the limit
	var number = parseInt(req.query.number);
	// results obtained by the first requirement
	var HighestRevResult;
	var LowestRevResult;
	// results obtained by the third requirement
	var LongestHistoryResult;
	var ShortestHistoryResult;
	// results obtained by the second requirement
	var LargestGroupResult;
	var SmallestGroupResult;
	// Define a function so that we wait for all the data retrieved
	// and then render the page.	
	
	function maxSteps (time, callback) {
		this.decline = function() {
			time -= 1;
			if (time == 0){
				callback();
			}
		};
	}
	var t = new maxSteps (6, function(){
		res.render("overallTable.pug", {
			HighestRevResult : HighestRevResult,
			LowestRevResult : LowestRevResult,
			LargestGroupResult : LargestGroupResult,
			SmallestGroupResult : SmallestGroupResult,
			LongestHistoryResult : LongestHistoryResult,
			ShortestHistoryResult : ShortestHistoryResult,
			number : number
		});});
	// Functions for overall data
	Revision.findHighestNumberRevision(number,function(err, result) {
		if (err) {
			console.log(err);
		} else {
			HighestRevResult = result;
			t.decline();
		}
	});

	Revision.findLowestNumberRevision(number,function(err, result) {
		if (err) {
			console.log(err);
		} else {
			LowestRevResult = result;
			t.decline();
		}
	});

	Revision.findLargestUserGroup(number,function(err, result) {
		if (err) {
			console.log(err);
		} else {
			LargestGroupResult = result;
			t.decline();
		}
	});

	Revision.findSmallestUserGroup(number,function(err, result) {
		if (err) {
			console.log(err);
		} else {
			SmallestGroupResult = result;
			t.decline();
		}
	});

	Revision.findLongestHistory(number,function(err, result) {
		if (err) {
			console.log(err);
		} else {
			LongestHistoryResult = result;
			t.decline();
		}
	});

	Revision.findShortestHistory(number,function(err, result) {
		if (err) {
			console.log(err);
		} else {
			ShortestHistoryResult = result;
			t.decline();
		}
	});
};
//loading bar/line chart for overall part
module.exports.overallBar=function(req,res){
	var val1 = new Object();
	var val2 = new Object();
	var val3 = new Object();
	var val4 = new Object();

	var a = function () {
		return new Promise(function (resolve, reject) {
			Revision.barAndLineRegular( function(err, result){
				if (err){
					console.log("Cannot find ")
				}
				else {	
					for(var i=0;i<result.length;i++) {
						var key = result[i]._id.toString();
						var value = result[i].numOfEdits;
						val1[key] = value;
					}
				}
				resolve("a")
			})
		})
	}
	var b = function (data) {
		return new Promise(function (resolve, reject) {
			Revision.barAndLineAnon( function(err, result){
				if (err){
					console.log("Cannot find ")
				}else{	
					for(var i=0;i<result.length;i++) {
						var key = result[i]._id.toString();
						var value = result[i].numOfEdits;
						val2[key] = value;
					}
				}
				resolve(data+"b");
			})
		})
	}
	var c = function (data) {
		return new Promise(function (resolve, reject) {
			Revision.barAndLineAdmin(function(err, result){
				if (err){
					console.log("Cannot find ")
				}else{		
					for(var i=0;i<result.length;i++) {
						var key = result[i]._id.toString();
						var value = result[i].numOfEdits;
						val3[key] = value;
					}
				}
				resolve(data+"c");
			})
		})
	}
	var d = function (data) {
		return new Promise(function (resolve, reject) {
			Revision.barAndLineBot(function(err, result){
				if (err){
					console.log("Cannot find ")
				}else{		
					for(var i=0;i<result.length;i++) {
						var key = result[i]._id.toString();
						var value = result[i].numOfEdits;
						val4[key] = value;
					}
				}	
				resolve(data+"d");
			})
		})
	}
	var e = function (data) {
		return new Promise(function (resolve, reject) {
			var valFinal = new Array();
			var Keys = Object.keys(val1);

			for (var i=0;i<Keys.length;i++) {
				valFinal[i] = new Array();
				valFinal[i][0] = Keys[i];
				valFinal[i][1] = val1[Keys[i]];
				if (Keys[i] in val2) {
					valFinal[i][2] = val2[Keys[i]];
				}
				else {
					valFinal[i][2] = 0;
				}
				if (Keys[i] in val3) {
					valFinal[i][3] = val3[Keys[i]];
				}
				else {
					valFinal[i][3] = 0;
				}
				if (Keys[i] in val4) {
					valFinal[i][4] = val4[Keys[i]];
				}
				else {
					valFinal[i][4] = 0;
				}
			}
			res.json(valFinal);

			resolve(data+"e");
		})
	}

	a()
	.then(function (data) {
		return b(data)
	})
	.then(function (data) {
		return c(data)
	})
	.then(function (data) {
		return d(data)
	})
	.then(function (data) {
		return e(data)
	})
}
//loading pie chart for overall part
module.exports.overallPie=function(req,res){
	var val1=0;
	var val2=0;
	var val3=0;
	var val4=0;

	var a = function () {
		return new Promise(function (resolve, reject) {
			Revision.pieRegular(function(err, result){
				if (err){
					console.log("Cannot find ")
				}else{	
					if(result!=null){
						val1 = result;
					}
				}
				resolve("a")
			})
		})
	}
	var b = function (data) {
		return new Promise(function (resolve, reject) {
			Revision.pieAnon(function(err, result){
				if (err){
					console.log("Cannot find ")
				}else{	
					if(result!=null){
						val2 = result;
					}
				}
				resolve(data+"b");
			})
		})
	}
	var c = function (data) {
		return new Promise(function (resolve, reject) {
			Revision.pieAdmin(function(err, result){
				if (err){
					console.log("Cannot find ")
				}else{		
					if(result!=null){
						val3 = result;
					}
				}
				resolve(data+"c");
			})
		})
	}
	var d = function (data) {
		return new Promise(function (resolve, reject) {
			Revision.pieBot(function(err, result){
				if (err){
					console.log("Cannot find ")
				}else{		
					if(result!=null){
						val4 = result;
					}
				}	
				resolve(data+"d");
			})
		})
	}
	var e = function (data) {
		return new Promise(function (resolve, reject) {
			var valFinal = new Array();
			
			valFinal[0] = new Array();
			valFinal[0][0] = "Regular";
			valFinal[0][1] = val1;
			valFinal[1] = new Array();
			valFinal[1][0] = "Anon";
			valFinal[1][1] = val2;
			valFinal[2] = new Array();
			valFinal[2][0] = "Admin";
			valFinal[2][1] = val3;
			valFinal[3] = new Array();
			valFinal[3][0] = "Bot";
			valFinal[3][1] = val4;
			res.json(valFinal);
			resolve(data+"e");
		})
	}

	a()
	.then(function (data) {
		return b(data)
	})
	.then(function (data) {
		return c(data)
	})
	.then(function (data) {
		return d(data)
	})
	.then(function (data) {
		return e(data)
	})	
}
//get the article list for individual part(to load drop down list)
module.exports.getArticleList=function(req,res){
	Revision.getAllArticles(function(err, result){
		if (err){
			console.log("Cannot find ")
		}else{
			res.json(result);
		}	
	})
}
//loading information table for individual part
module.exports.informationTable=function(req,res){
	var title = req.query.title;
	var num ;
	var history = req.query.history;	
	var from = req.query.from;
	var to = req.query.to;

	var a = function () {
		return new Promise(function (resolve, reject) {
			Revision.findTitleRevisionNumber(title,from,to, function(err, result){
				if (err){
					console.log("Cannot find ")
				}else{		
					num = result;			
				}
				resolve("a");
			})
		})
	}
	var b = function (data) {
		return new Promise(function (resolve, reject) {
			Revision.findTopAuthors(title,from,to, function(err, result){
				if (err){
					console.log("Cannot find ")
				}else{		
					tops = result;
					var hisInfo;
					if (history=="no") {
						hisInfo = "The database is up to date";
					}
					else {
						hisInfo = "The database is old, " + history + " new revisions are downloaded"
					}
					res.render('information.pug',{num:num, title:title,tops:tops,historyInfo:hisInfo});
				}
				resolve(data+"b");
			})
		})
	}

	a()
	.then(function (data) {
		return b(data)
	})	
}
//loading the pie chart for individual part
module.exports.getGraphs1=function(req,res){
	var title = req.query.title;
	var from = req.query.from;
	var to = req.query.to;
	var val1=0;
	var val2=0;
	var val3=0;
	var val4=0;

	var a = function () {
		return new Promise(function (resolve, reject) {
			Revision.getRevisionsRegular(title,from,to, function(err, result){
				if (err){
					console.log("Cannot find ")
				}else{	
					if(result[0]!=null){
						val1 = result[0].numOfEdits;
					}
				}
				resolve("a")
			})
		})
	}
	var b = function (data) {
		return new Promise(function (resolve, reject) {
			Revision.getRevisionsAnon(title,from,to, function(err, result){
				if (err){
					console.log("Cannot find ")
				}else{	
					if(result[0]!=null){
						val2 = result[0].numOfEdits;
					}
				}
				resolve(data+"b");
			})
		})
	}
	var c = function (data) {
		return new Promise(function (resolve, reject) {
			Revision.getRevisionsAdmin(title,from,to, function(err, result){
				if (err){
					console.log("Cannot find ")
				}else{		
					if(result[0]!=null){
						val3 = result[0].numOfEdits;
					}
				}
				resolve(data+"c");
			})
		})
	}
	var d = function (data) {
		return new Promise(function (resolve, reject) {
			Revision.getRevisionsBot(title, from,to,function(err, result){
				if (err){
					console.log("Cannot find ")
				}else{		
					if(result[0]!=null){
						val4 = result[0].numOfEdits;
					}
				}	
				resolve(data+"d");
			})
		})
	}
	var e = function (data) {
		return new Promise(function (resolve, reject) {

			var valFinal = new Array();
			valFinal[0] = new Array();
			valFinal[0][0] = "Regular";
			valFinal[0][1] = val1;
			valFinal[1] = new Array();
			valFinal[1][0] = "Anon";
			valFinal[1][1] = val2;
			valFinal[2] = new Array();
			valFinal[2][0] = "Admin";
			valFinal[2][1] = val3;
			valFinal[3] = new Array();
			valFinal[3][0] = "Bot";
			valFinal[3][1] = val4;

			res.json(valFinal);
			resolve(data+"e");
		})
	}

	a()
	.then(function (data) {
		return b(data)
	})
	.then(function (data) {
		return c(data)
	})
	.then(function (data) {
		return d(data)
	})
	.then(function (data) {
		return e(data)
	})
}
//loading the first bar chart for individual part
module.exports.getGraphs2=function(req,res){
	var title = req.query.title;
	var from = req.query.from;
	var to = req.query.to;
	var val1 = new Object();
	var val2 = new Object();
	var val3 = new Object();
	var val4 = new Object();

	var a = function () {
		return new Promise(function (resolve, reject) {

			Revision.getRevisionsByYearRegular(title, from,to,function(err, result){
				if (err){
					console.log("Cannot find ")
				}else{	
					for(var i=0;i<result.length;i++) {
						var key = result[i]._id.toString();
						var value = result[i].numOfEdits;
						val1[key] = value;
					}
				}
				resolve("a");
			})
		})
	}

	var b = function (data) {
		return new Promise(function (resolve, reject) {
			Revision.getRevisionsByYearAnon(title, from,to, function(err, result){
				if (err){
					console.log("Cannot find ")
				}else{		
					for(var i=0;i<result.length;i++) {
						var key = result[i]._id.toString();
						var value = result[i].numOfEdits;
						val2[key] = value;
					}
				}
				resolve(data+"b");
			})
		})
	}
	var c = function (data) {
		return new Promise(function (resolve, reject) {
			Revision.getRevisionsByYearAdmin(title, from,to, function(err, result){
				if (err){
					console.log("Cannot find ")
				}else{		
					for(var i=0;i<result.length;i++) {
						var key = result[i]._id.toString();
						var value = result[i].numOfEdits;
						val3[key] = value;
					}
				}
				resolve(data+"c");
			})
		})
	}
	var d = function (data) {
		return new Promise(function (resolve, reject) {
			Revision.getRevisionsByYearBot(title, from,to, function(err, result){
				if (err){
					console.log("Cannot find ")
				}else{		
					for(var i=0;i<result.length;i++) {
						var key = result[i]._id.toString();
						var value = result[i].numOfEdits;
						val4[key] = value;
					}
				}
				resolve(data+"d");
			})
		})
	}
	var e = function (data) {
		return new Promise(function (resolve, reject) {
			var valFinal = new Array();
			var Keys = Object.keys(val1);

			for (var i=0;i<Keys.length;i++) {
				valFinal[i] = new Array();
				valFinal[i][0] = Keys[i];
				valFinal[i][1] = val1[Keys[i]];
				if (Keys[i] in val2) {
					valFinal[i][2] = val2[Keys[i]];
				}
				else {
					valFinal[i][2] = 0;
				}
				if (Keys[i] in val3) {
					valFinal[i][3] = val3[Keys[i]];
				}
				else {
					valFinal[i][3] = 0;
				}
				if (Keys[i] in val4) {
					valFinal[i][4] = val4[Keys[i]];
				}
				else {
					valFinal[i][4] = 0;
				}

			}
			res.json(valFinal);

			resolve(data+"e");
		})
	}

	a()
	.then(function (data) {
		return b(data)
	})
	.then(function (data) {
		return c(data)
	})
	.then(function (data) {
		return d(data)
	})
	.then(function (data) {
		return e(data)
	})
}
//loading top5 authors of the second bar chart for individual part
module.exports.getGraphs3=function(req,res){
	var from = req.query.from;
	var to = req.query.to;
	var title = req.query.title;
	res.render("Graph3.pug",{user1:tops[0]._id,user2:tops[1]._id,user3:tops[2]._id,user4:tops[3]._id,
		user5:tops[4]._id,title:title,from:from,to:to});
}
//loading all revision articles for a searched user for author part
module.exports.getArticleList=function(req,res){
	var user = req.query.user;
	
	Revision.getRevisionedArticle(user, function(err, result){
		if (err){
			console.log("Cannot find ")
		}else{
			res.render("author.pug",{articles:result,user:user});
		}	
	})
}
//loading all revision times of an article for a searched user for author part
module.exports.showTimes=function(req,res){
	var title = req.query.title;
	var user = req.query.user;

	Revision.getAllTimes(user, title, function(err, result){
		if (err){
			console.log("Cannot find ")
		}else{
			res.render("timestamp.pug",{times:result});
		}	
	})
}
//loading the second bar chart for individual part
module.exports.showGraph3=function(req,res){
	var title = req.query.title;
	var user = req.query.user;
	var from = req.query.from;
	var to = req.query.to;

	Revision.revisionsUserYear(user, title, from,to,function(err, result){
		if (err){
			console.log("Cannot find ")
		}else{
			var val = new Object();
			for(var i=0;i<result.length;i++) {
				var key = result[i]._id.toString();
				var value = result[i].numOfEdits;
				val[key] = value;
			}
			res.json(val);
		}	
	})
}
//check whether the history in database is up to date for individual part
module.exports.checkHistory=function(req,res){
	var title = req.query.title;
	var record=0;

	Revision.getLast(title, function(err, result){
		if (err){
			console.log("Cannot find ")
		}else{
			var now = new Date().getTime();
			var theDate = result[0].timestamp;
			var last =  result[0].timestamp.getTime();
			var total = (now - last)/1000;
			var day = total / (24*60*60);
			
			if(day>1){
				var year = theDate.getUTCFullYear().toString();
				var month = theDate.getUTCMonth()+1;
				if(month<10) {
					month = "0" + month.toString();
				}
				else {
					month = month.toString();
				}
				var Day = theDate.getUTCDate();
				if(Day<10) {
					Day = "0" + Day.toString();
				}
				else {
					Day = Day.toString();
				}				
				var hours = theDate.getUTCHours();
				if(hours<10) {
					hours = "0" + hours.toString();
				}
				else {
					hours = hours.toString();
				}			
				var minutes = theDate.getUTCMinutes();
				if(minutes<10) {
					minutes = "0" + minutes.toString();
				}
				else {
					minutes = minutes.toString();
				}

				var dataString = year+"-"+month+"-"+Day+"T"+hours+":"+minutes+":59.999Z"
				var url = "https://en.wikipedia.org/w/api.php";
				var params = {
						action: "query",
						prop: "revisions",
						titles: title,
						rvprop: "timestamp|user",
						formatversion: "2",
						format: "json",
						rvend: dataString,
						rvslots: "main",
						rvlimit: "max"
				};

				url = url + "?origin=*";
				Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

				fetch(url)
				.then(function(response){return response.json();})
				.then(function(response) {
					var pages = response.query.pages;
					for (var p in pages) {
						for (var r in pages[p].revisions) {
							var aRevision = new Revision();

							aRevision.title=title;
							aRevision.user=pages[p].revisions[r].user;
							aRevision.timestamp=new Date(pages[p].revisions[r].timestamp);

							if(pages[p].revisions[r].anon){
								aRevision.anon = true;
							}
							if(admins.includes(pages[p].revisions[r].user)){
								aRevision.admin = true;
							}
							if(bots.includes(pages[p].revisions[r].user)){
								aRevision.bot = true;
							}
							
			            	aRevision.save();
							record++;
						}
					}
					res.json(record);
				})
				.catch(function(error){console.log(error);});
			}
			else {
				res.json("no")
			}
		}	
	})
}
//get all regular users
module.exports.getSource=function(req,res){
	Revision.getAllName(function(err, result){
		if (err){
			console.log("Cannot find ")
		}else{
			res.json(result);
		}	
	})
}
//show the landing page
module.exports.showLandingPage = function (req, res) {
	res.render('landing.pug');
};
//show the login page
module.exports.showLoginPage = function (req, res) {
	res.render('login_page.pug');
};
//show the sign in page
module.exports.showSigninPage = function (req, res) {
	res.render('sign_in_page.pug');
};
//show the reset password page
module.exports.showResetPage = function (req, res) {
	res.render('reset_first.pug');
};
//when logout, go back landing page
module.exports.logOut = function (req, res) {
	UserName = '';
	req.session.userName = null;
	res.render('landing.pug');
};
//save user data when a new user sign in
module.exports.insertUser = function (req, res) {
	Firstname = req.body.fname;
	Lastname = req.body.lname;
	Email = req.body.uname;
	Password = req.body.psw;
	ResetQuestion = req.body.resetq;
	ResetAnswer = req.body.reseta;

	UserData.getDocument(Email, function (err, result) {
		if (err) {
			console.log("Error!")
		} else {
			if (result == '') {
				var hashedPassword = passwordHash.generate(Password);
				var data = new UserData({
					firstname: Firstname,
					lastname: Lastname,
					username: Email,
					password: hashedPassword,
					resetquestion: ResetQuestion,
					resetanswers: ResetAnswer
				});
				data.save(function (err) {
					if (err) return handleError(err);
				});
				UserName = Email;
				res.render('login_page.pug');
			}
			else {
				console.log("You already have an account, please log in!");
				res.render("login_page.pug");
			}
		}
	});
};
//show the reset password page
module.exports.ResetPage = function (req, res) {
	Email = req.body.uname;
	Password = req.body.psw;

	UserData.getDocument(Email, function (err, result) {
		if (err) {
			console.log("Error!")
		} else {
			if (result == '') {
				console.log("You have to first have an account")
				res.render("sign_in_page.pug");
			}
			else {
				if (passwordHash.verify(Password, result[0].password)) {
					UserName = Email;
					res.render("reset_password_page.pug", { data: result[0].resetquestion });
				}
				else {
					console.log("Incorrect Password");
					res.render('reset_first.pug');
				}
			}
		}
	});
};
//reset password by verification problem
module.exports.Reset = function (req, res) {
	answer = req.body.answer;
	newpassword = req.body.psw;

	UserData.getDocument(UserName, function (err, result) {
		if (err) {
			console.log("Error!")
		} else {
			if (result[0].resetanswers == answer) {
				var hashedPassword = passwordHash.generate(newpassword)
				UserData.updateOne({ 'username': UserName },
						{ $set: { 'password': hashedPassword } }, function (err, result) {
							if (err) {
								console.log("Update error!")
							} else {
								console.log(result);
							}
						});
				res.render("login_page.pug");
			}
			else {
				console.log("Incorrect Answer");
				res.render('reset_password_page.pug');
			}
		}
	});
}
