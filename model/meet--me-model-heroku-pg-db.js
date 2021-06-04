'use strict';

const sql = require('./db.heroku-pg.js');
const bcrypt = require('bcrypt')

function makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
    	result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
   	}  
   return result.join('');
}





exports.addMeeting = function (newData, callback) {
 	console.log(newData)


    function checkIfUrlExists (url, callback) {

		const query = {
			text: "SELECT \"MeetingId\" FROM public.\"Meeting\" WHERE \"MeetingUrl\" = $1",
			values: [url],
		}

      	sql.query(query, (err, res) => {
			if (err) {
				console.log(err.stack)
				callback(err.stack)
			}
			else {
				callback(null, res.rowCount==0)
			}
		})
    }

	let url = makeid(6);
	console.log(url)

	function callbackFunc(err, check) {
		if (err) {
			callback(err);
		}
		if (!check){
			url = makeid(6)
			checkIfUrlExists(url,callbackFunc)
		}
		else {
			createMeeting();
		}
	}

    checkIfUrlExists (url, callbackFunc);
 

	function createMeeting(){
		let userId = 1
		const query = {
			text: `INSERT INTO public."Meeting" \
			("MeetingState", "MeetingTitle", "MeetingDescription", "MeetingDateCreated", \
			"MeetingSingleVote", "MeetingUrl","MeetingCreator") \
			VALUES	('open', $1, $2, CURRENT_TIMESTAMP, $3, $4, $5) RETURNING "MeetingId";`,
			values: [newData.name, newData.description, newData.oneVote, url, userId],
		}
	
		sql.query(query, (err, result) => {
			if (err)
				callback(err.stack, null);
			else {
				writeDates(result.rows[0].MeetingId)
			}
		})		
	}

	function writeDates() {
		callback(null, url)
	}

    //db querry
    // if (err) {
    //     callback(err)
    // }   

    // check if it exists in db

    
}


exports.viewVotes = function (newData, callback) {
  console.log(newData)

  let url = makeid(6)

  callback(null, url)
}


exports.submitVotes = function (newData, callback) {
  console.log(newData)

  let url = makeid(6)

  callback(null, url)
}

