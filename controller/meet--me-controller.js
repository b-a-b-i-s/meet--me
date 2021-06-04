'use strict';

const model = require('../model/meet--me-model-heroku-pg-db.js');

require('dotenv').config();
const port = process.env.PORT || '3000';
const host = process.env.PORT ? "localhost:"+port : 'meet--me.herokuapp.com'
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
        partialContext: {name: 'Test username'}
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
    
    model.getDates(req.params.url, (err, data, votes, meetingInfo) => {
        if (err) {
            res.send(err);
        }
        votes.forEach(el => {
            if (el.UserIdVote != 9) el.UserIdVote = true//req.session.useid
            else el.UserIdVote = false
        });
        res.json( { 
            data:data,
            votes:votes,
            meetingInfo : meetingInfo
        })
    });
}

