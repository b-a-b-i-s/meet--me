
'use strict';

const express = require('express');
const router = express.Router({caseSensitive:true});

const meetMeController = require('../controller/meet--me-controller');

//fetch
router.get('/meeting/get-data/:url',  meetMeController.getDates)
router.post('/meeting/choose-fianl-option/:url',meetMeController.checkAuthenticated, meetMeController.chooseFinalOption)
router.post('/meeting/add-votes/:url/:name',  meetMeController.addVotes)
router.post('/add-meeting',meetMeController.checkAuthenticated, meetMeController.addMeeting);

router.get('/meeting/:url',  meetMeController.renderVote)

router.get('/create-meetme',  meetMeController.checkAuthenticated, (req, res) => res.render('create_meetme',{partialContext: {name:req.session.loggedUserName}, loggedin:true}));

router.all('/publish/:url',meetMeController.checkAuthenticated, meetMeController.publish);

router.get('/loggedin',meetMeController.checkAuthenticated, (req, res) => res.render('index', {partialContext: {name:req.session.loggedUserName}, loggedin:true}))

router.get('/mymeetings', meetMeController.checkAuthenticated, meetMeController.showMyMeetings);

router.get('/',meetMeController.checkAuthenticated, (req, res) => res.render('index'))


//log in-------------------------------------------------------------------------------------------------
router.post('/login', meetMeController.doLogin);
router.post('/signup', meetMeController.doRegister);
router.get('/login', (req, res) => res.render('index', {needtolog:true}));
router.get('/loggedin', (req, res) => res.render('index', {partialContext: {name:req.session.loggedUserName}, loggedin:true}))
router.get('/logout', meetMeController.doLogout)
router.get('/afterregister',(req, res) => res.render('index', {aftersignup:true}))
router.get('/failed',(req, res) => res.render('index', { failedloggin: true }))


// router.all('*', (req, res) => res.render('not_found', {layout: '404'}))


module.exports = router;
