'use strict';
/** You can define other models as well, e.g. postgres */
const model = require('../model/meet--me-model-heroku-pg-db.js');


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
    res.render('publish', { "url":'meet--me.herokuapp.com/meeting/'+req.params.url})
}

