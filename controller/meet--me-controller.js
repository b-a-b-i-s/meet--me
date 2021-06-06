'use strict';

const model = require('../model/meet--me-model-heroku-pg-db.js');
const bcrypt = require('bcrypt')


exports.addMeeting = (req, res) => {
    model.addMeeting(req.body, req.session.loggedUserId, (err, url) => {
        if (err) {
            res.send(err);
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end(url, 'utf-8')
    });
}

exports.publish = (req, res) => {    
    res.render('publish', { 
        url:req.headers.host+'/meeting/'+req.params.url,
        shorturl:'/meeting/'+req.params.url,
        loggedin:true,
        partialContext: {name: req.session.loggedUserName}
        // name:req.session.userName
    })
}
    

exports.renderVote = (req, res) => {
    if (!req.session.userId) {
        model.addTempUser(req, (err, user)=> {
            if (err) {
                console.log(err)
                res.send(err)
            }

            req.session.userId = user.userId
            req.session.name = user.name
            req.session.tempUserId = user.id


            async function saveit(){
                await req.session.save()
                console.log(req.session)
                model.checkIfClosedAndIfUserIsCreator(req, (err, closed, check) => {
                    if (err) {
                        res.send(err);
                    }
                    if (closed){
                        res.render('vote',{open:false});
                    }
                    else {
                        res.render('vote',{open:true})
                    }
                    
                }); 
            }
            saveit();

        })
    }
    else {
        model.checkIfClosedAndIfUserIsCreator(req, (err, closed, check) => {
            if (err) {
                res.send(err);
            }
            if (closed){
                if (req.session.loggedUserId) {
                    res.render('vote',{open:false, isCreator:check, partialContext: {name:req.session.loggedUserName}, loggedin:true});
                }
                else {
                    res.render('vote',{open:false})
                }
            }
            else {
                if (req.session.loggedUserId) {
                    res.render('vote',{name:req.session.loggedUserName, open:true, isCreator:check, partialContext: {name:req.session.loggedUserName}, loggedin:true});
                }
                else {
                    res.render('vote',{open:true})
                }
            }
        }); 
    }
    
    
    
    
    

}

exports.getDates = (req, res) => {
    let userId = req.session.userId;
    
    model.getDates(req, (err, data, votes, meetingInfo, userName) => {
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

    if (req.session.loggedUserName) req.session.loggedUserName = req.params.name
    
    model.checkIfClosedAndIfUserIsCreator(req, (err, closed, check) => {
        if (err) {
            res.send(err);
        }
        if (closed){
            res.render('vote',{open:false});
        }
        else {
            model.addVotes(req, (err, invalid) => {
                if (err) {
                    res.send(err);
                }
                if (invalid) {
                    res.writeHead(200, { 'Content-Type': 'text/plain' })
                    res.end('invalid', 'utf-8')
                }
        
                res.writeHead(200, { 'Content-Type': 'text/plain' })
                res.end('votes updated', 'utf-8')
            });
        }

    }); 


    
}

exports.chooseFinalOption = (req, res) => {
    
    model.chooseFinalOption(req, (err) => {
        if (err) {
            res.send(err);
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('selected final date', 'utf-8')
    });
}










///// LOGIN REDISTER /////




exports.doLogin = function (req, res) {
    //Ελέγχει αν το username και το password είναι σωστά και εκτελεί την
    //συνάρτηση επιστροφής authenticated

    model.getUserByUsername(req.body.UserEmail, (err, user) => {
        if (user == undefined) {
            res.render('index', { failedloggin: true });
        }
        else {
            //Θέτουμε τη μεταβλητή συνεδρίας "loggedUserId"
            async function checkcode(){
                console.log(req.body.UserPass)
                                
                bcrypt.compare(req.body.UserPass, user.password, function(err, isMatch) {

                    if (err) {
                    throw err
                    } else if (!isMatch) {
                        res.redirect("/failed");
                    } else {
                        req.session.loggedUserId = user.id;
                        req.session.loggedUserName= user.username;
                        req.session.userId = user.userId
            
                        async function saveit(){
                            await req.session.save()
                            console.log(req.session)
                            const redirectTo = "/loggedin";               
                            res.redirect(redirectTo);
                        }
                        saveit();
                    }
                })
            }
            checkcode();
        }
    })
}

//Τη χρησιμοποιούμε για να ανακατευθύνουμε στη σελίδα /login όλα τα αιτήματα από μη συνδεδεμένςου χρήστες
exports.checkAuthenticated = function (req, res, next) {
    //Αν η μεταβλητή συνεδρίας έχει τεθεί, τότε ο χρήστης είναι συνεδεμένος
    if(req.originalUrl=="/" && req.session.loggedUserId){
        console.log("efttasa")
        res.render('index', {partialContext: {name:req.session.loggedUserName}, loggedin:true})
    }
    else if(req.originalUrl=="/"){
        next()
    }
    else if (req.session.loggedUserId) {
        console.log("user is authenticated", req.originalUrl);
        //Καλεί τον επόμενο χειριστή (handler) του αιτήματος
        next();
    }
    else {
        res.redirect('/login');
    }
}


exports.doLogout = (req, res) => {
    //Σημειώνουμε πως ο χρήστης δεν είναι πια συνδεδεμένος
    console.log("loggedout")
    req.session.destroy();
    res.redirect('/');
}

exports.doRegister = function (req, res) {
    // model.registerUser(req.body.username, req.body.password, (err, result, message) => {
    model.registerUser(req.body.UserName, req.body.UserEmail, req.body.UserPass, (err, result, message) => {
        
        if (err) {
            console.error('registration error: ' + err);
            res.render('index', { message: 'An error occured in the database' });
        }
        else if (message) {
            res.render('index')
        }
        else {
            res.redirect('/afterregister');
        }
    })
}

exports.showMyMeetings = function (req, res) {
    
    model.showMyMeetings(req, (err, result) => {
        
        if (err) {
            console.error('registration error: ' + err);
            res.render('index');
        }
        else {
            console.log(result)
            res.render('mymeetings', {meeting:result, partialContext: {name:req.session.loggedUserName}, loggedin:true})

        }
    })
}
