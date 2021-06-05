'use strict';

const model = require('../model/meet--me-model-heroku-pg-db.js');

require('dotenv').config();
const port = process.env.SECRET || '3000';
const host = "localhost:"+port
// const host = 'meet--me.herokuapp.com'

exports.addMeeting = (req, res) => {
    model.addMeeting(req.body, (err, url) => {
        if (err) {
            res.send(err);
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end(url, 'utf-8')
    });
}

exports.publish = (req, res) => {
    res.render('publish', { 
        url:host+'/meeting/'+req.params.url,
        shorturl:'/meeting/'+req.params.url,
        loggedin:true,
        partialContext: {name: req.session ? req.session.loggedUserId : 'test usr'}
        // name:req.session.userName
    })
}


exports.renderVote = (req, res) => {
    res.render('vote', { 
        url:req.params.url,
        // votes:votes
        // loggedin:session.
        // name:req.session.userName
    })
}



exports.getDates = (req, res) => {
    let userId = req.session ? req.session.loggedUserId : 9
    model.getDates(req.params.url, userId, (err, data, votes, meetingInfo, userName) => {
        if (err) {
            res.send(err);
        }
        if (votes) {
            votes.forEach(el => {
                if (el.UserIdVote === userId) el.UserIdVote = true//req.session.useid
                else el.UserIdVote = false
            });
        }
        res.json( { 
            data:data,
            votes:votes,
            meetingInfo : meetingInfo,
            thisUserName : userName
        })
    });
}

exports.addVotes = (req, res) => {
    let userId = req.session ? req.session.loggedUserId : 9
    
    model.addVotes(req.params.url, req.body, userId, (err) => {
        if (err) {
            res.send(err);
        }

        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('votes updated', 'utf-8')
    });
}

