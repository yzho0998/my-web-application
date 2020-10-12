var express = require('express');
var controller = require('../controllers/server.controller');
var router = express.Router();

router.get('/', controller.showLandingPage);//1
router.post('/login', controller.showLoginPage);//2
router.post('/signin', controller.showSigninPage);//3
router.post('/resetpage',controller.showResetPage)//4
router.post('/signup', controller.insertUser);//5
router.post('/resetpwdpage', controller.ResetPage);//6
router.post('/reseting', controller.Reset);//7
router.post('/logout',controller.logOut);//8

router.post('/check',controller.checkUser);
router.get('/logining',controller.showMainPage);
router.get('/logining/getOverallTable',controller.getOverallTable);
router.get('/logining/overallBar',controller.overallBar);
router.get('/logining/overallPie',controller.overallPie);
router.get('/logining/information', controller.informationTable);
router.get('/logining/getGraphs1', controller.getGraphs1);
router.get('/logining/getGraphs2', controller.getGraphs2);
router.get('/logining/getGraphs3', controller.getGraphs3);
router.get('/logining/userInformation', controller.getArticleList);
router.get('/logining/getTimestamps', controller.showTimes);
router.get('/logining/showGraph3', controller.showGraph3);
router.get('/logining/checkHistory', controller.checkHistory);
router.get('/logining/getSource', controller.getSource);


module.exports = router;