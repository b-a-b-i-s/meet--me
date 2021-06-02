'use strict';

const sql = require('./db.heroku-pg.js');
const bcrypt = require('bcrypt')

function makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
 charactersLength)));
   }
   return result.join('');
}


exports.addMeeting = function (newData, callback) {
    console.log(newData)

    //db querry
    // if (err) {
    //     callback(err)
    // }


    let url = makeid(6)

    // check if it exists in db

    callback(null, url)
}

