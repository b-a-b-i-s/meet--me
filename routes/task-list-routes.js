'use strict';

const express = require('express');
const router = express.Router();

const taskListController = require('../controller/task-list-controller');


router.get('/mymeetings', (req, res) => res.render('mymeetings'));
router.get('/monthly_calendar', (req, res) => res.render('monthly_calendar'));
router.get('/publish', (req, res) => res.render('publish'));
router.get('/', (req, res) => res.render('index'))
router.all('*', (req, res) => res.render('not_found',{layout: '404'}))



module.exports = router;