'use strict';

const express = require('express');
const router = express.Router({caseSensitive:true});

const meetMeController = require('../controller/meet--me-controller');


router.get('/mymeetings', (req, res) => res.render('mymeetings'));

router.get('/monthly_calendar', (req, res) => res.render('monthly_calendar'));

// router.get('/monthly_calendar', meetMeController.monthView);

router.post('/add-meeting', meetMeController.addMeeting);

router.all('/publish/:url', meetMeController.publish);

router.get('/loggedin', (req, res) => res.render('index', {partialContext: {name:"John Doe"}, loggedin:true}))

router.get('/', (req, res) => res.render('index'))




// router.all('*', (req, res) => res.render('not_found', {layout: '404'}))



module.exports = router;