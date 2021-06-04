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

function getMeetingIdFromUrl(url, callback) {

	const query = {
		text: `SELECT "MeetingId" FROM public."Meeting" WHERE "MeetingUrl" = $1`,
		values: [url],
	}

	  sql.query(query, (err, res) => {
		if (err) {
			console.log(err.stack)
			callback(err.stack)
		}
		else {
			callback(null, res)
		}
	})
}

exports.addMeeting = function (newData, callback) {
 	console.log(newData)

	let url = makeid(6);
	console.log(url)

	getMeetingIdFromUrl(url, callbackFunc);

	function callbackFunc(err, result) {
		if (err) {
			callback(err);
		}
		if (result.rowCount !== 0){
			url = makeid(6)
			console.log(url)
			getMeetingIdFromUrl(url,callbackFunc)
		}
		else {
			createMeeting();
		}
	} 

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

	function writeDates(MeetingId) {
		const promiseList = []
		newData.lista.forEach((element, index) => {
			const year = element.date.slice(-4)
			const month = element.date.slice(0,2)
			const day = element.date.slice(3,5)
			const startHour = element.startTime.slice(0,2)
			const endHour = element.endTime.slice(0,2)
			const startMinutes = element.startTime.slice(3,5)
			const endMinutes = element.endTime.slice(3,5)

			const startTimestamp = `make_timestamp(${year},${month},${day},${startHour},${startMinutes},0.0)`
			const endTimestamp = `make_timestamp(${year},${month},${day},${endHour},${endMinutes},0.0)`

			const query = {
				text: `INSERT INTO public."Date" \
				("MeetingId", "DateId", "StartDate", "EndDate") VALUES
				($1, $2, ${startTimestamp}, ${endTimestamp});`,
				values: [MeetingId, index+1],
				}
			promiseList.push(
				sql.query(query, (err, result) => {
					if (err)
						callback(err.stack, null);
					else {
						console.log(result)
					}
				})
			)
		});
		Promise.all(promiseList)
			.then(callback(null, url))
			.catch(e => callback(e))
	}

}


exports.getDates = function (url, callback) {
	// console.log(url)

	// let meetingId;
	const data = [];
	let meetingInfo;
	let meetingId;

	new Promise( (resolve) => {
		getMeetingIdFromUrl(url, (err, result) => {
			if (err) {
				callback(err);
			}
			meetingId = result.rows[0].MeetingId
			resolve(meetingId)
		})
	})
	.then( (meetingId) => {
		return new Promise((resolve) => {
			const query = {
				text: `SELECT * FROM public."Date" WHERE "MeetingId" = $1`,
				values: [meetingId],
			}
		
			sql.query(query, (err, res) => {
				if (err) {
					console.log(err.stack)
					callback(err.stack)
				}
				else {
					// res()
					res.rows.forEach((el) => {
						let endTime;
						if (el.EndDate.getHours() == 0 && el.EndDate.getMinutes()==0) endTime = '24:00';
						else {
							let endHour = el.EndDate.getHours()<10 ? '0'+el.EndDate.getHours() : el.EndDate.getHours()
							let endMinutes = el.EndDate.getMinutes()<10 ? '0'+el.EndDate.getMinutes() : el.EndDate.getMinutes()
							endTime = `${endHour}:${endMinutes}`
						}
						let startHour = el.StartDate.getHours()<10 ? '0'+el.StartDate.getHours() : el.StartDate.getHours()
						let startMinutes = el.StartDate.getMinutes()<10 ? '0'+el.StartDate.getMinutes() : el.StartDate.getMinutes()
						data.push({
							date : el.StartDate.toLocaleString("en-US", {day: "2-digit", month: "2-digit", year: "numeric"}),
							startTime : `${startHour}:${startMinutes}`,
							endTime : endTime,
							dateId : el.DateId
						})
					})
					resolve(meetingId)
					// callback(null, data, votes)
				}
			})
		})
	})
	.then( (meetingId) => {
		return new Promise((resolve) => {
			const query = {
				text: `SELECT * FROM public."Meeting" WHERE "MeetingId" = $1`,
				values: [meetingId],
			}
		
			sql.query(query, (err, res) => {
				if (err) {
					console.log(err.stack)
					callback(err.stack)
				}
				else {
					// res()
					meetingInfo = 	{
						description : res.rows[0].MeetingDescription,
						singleVote : res.rows[0].MeetingSingleVote,
						state : res.rows[0].MeetingState,
						title : res.rows[0].MeetingTitle,
						createdTime : res.rows[0].MeetingDateCreated.toLocaleDateString()
					}
					resolve(res.rows[0].MeetingCreator)
					// callback(null, data, votes)
				}
			})
		})
	})
	.then( (MeetingCreatorId) => {
		return new Promise((resolve) => {
			const query = {
				text: `SELECT "SignedUserId" FROM public."User" WHERE "UserId" = $1`,
				values: [MeetingCreatorId],
			}
		
			sql.query(query, (err, res) => {
				if (err) {
					console.log(err.stack)
					callback(err.stack)
				}
				else {
					// res()
					resolve(res.rows[0].SignedUserId)
					// callback(null, data, votes)
				}
			})
		})
	})
	.then( (CreatorId) => {
		return new Promise((resolve) => {
			const query = {
				text: `SELECT "UserName" FROM public."Signed User" WHERE "SignedUserId" = $1`,
				values: [CreatorId],
			}
		
			sql.query(query, (err, res) => {
				if (err) {
					console.log(err.stack)
					callback(err.stack)
				}
				else {
					// res()
					meetingInfo["creatorName"] = res.rows[0].UserName
					resolve()
					// callback(null, data, votes)
				}
			})
		})
	})
	.then( () => {
		const query = {
			text: `SELECT * FROM public."Vote" WHERE "MeetingId" = $1`,
			values: [meetingId],
		}
	
		  sql.query(query, (err, res) => {
			if (err) {
				console.log(err.stack)
				callback(err.stack)
			}
			else {
				// res()
				const votes = [];

				res.rows.forEach((el) => {
					votes.push({
						UserIdVote : el.UserIdVote,
						VoteDateId : el.VoteDateId,
						Name : el.Name
					})
				})
				callback(null, data, votes, meetingInfo)
			}
		})
	})

	
	
  	

}


exports.submitVotes = function (newData, callback) {
	console.log(newData)

	let url = makeid(6)

	callback(null, url)
}

