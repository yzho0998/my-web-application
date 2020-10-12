/**
 * The file to start a server
 */

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var surveyRouter = require('./app/routes/server.routes');
var app = express();

app.set('views', path.join(__dirname,'/app/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(session({
    secret: 'jimmy',
    cookie: {maxAge: 1800000},
    resave: true,
    saveUninitialized: true
}));
app.use('/',surveyRouter);


app.listen(3000, function () {
	  console.log('Revision app listening on port 3000!')
	});
	
module.exports = app;
