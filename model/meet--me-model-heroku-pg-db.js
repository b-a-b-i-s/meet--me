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
		text: `SELECT "MeetingId" FROM public."Meeting" WHERE "MeetingUrl" = $1;`,
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

function getNamesById(userIds, callback) {

	// const userIdToName;

	const query = {
		text: `SELECT * FROM public."User" WHERE "UserId" = ANY($1::int[]);`,
		values: [userIds],
	}
	sql.query(query)
		.then(res => {
			// console.log(res)
			const IdsToSignedTempIds = {};
			// const TempIdToUserId = {}
			// const SignedIdToUserId = {}
			res.rows.forEach(el => {
				if (el.TempId) IdsToSignedTempIds[el.UserId] = {TempId:el.TempId};
				else IdsToSignedTempIds[el.UserId] = {SignedUserId:el.SignedUserId}
			})
			getNames(IdsToSignedTempIds);
		})
		.catch(e => {
			console.log(e)
			callback(e)
		})

	function getNames(IdsToSignedTempIds){
		// const TempIds = IdsToSignedTempIds.filter(el => el.TempId)
		const promiseList = [];

		for (const [id, value] of Object.entries(IdsToSignedTempIds)) {
			let query;
			if (value.SignedUserId) {
				query = {
					text: `SELECT * FROM public."Signed User" WHERE "SignedUserId" = $1;`,
					values: [value.SignedUserId],
				}
			}
			else {
				query = {
					text: `SELECT * FROM public."Temporary User" WHERE "TempId" = $1;`,
					values: [value.TempId],
				}
			}
			promiseList.push(
				sql.query(query)
			)
		}
		Promise.all(promiseList)
			.then(res => {
				// console.log(res)
				const TempNames = {};
				const SignedNames = {}
				res.forEach(eachRes => {
					let el = eachRes.rows[0];
					if (el.SignedUserId) {
						SignedNames[el.SignedUserId] = el.UserName
						
					}
					else {
						TempNames[el.TempId] = el.TempName
					}
				})
				for (const [id, value] of Object.entries(IdsToSignedTempIds)) {
				
					if (value.SignedUserId) {
						value.name = SignedNames[value.SignedUserId];
					}
					else {
						value.name = TempNames[value.TempId];
					}
				}
				callback(null, IdsToSignedTempIds)
			})
			.catch(e => {
				console.log(e)
				callback(e)
			})
	}

}

exports.addMeeting = function (newData, callback) {
 	// console.log('addong to db', newData)

	let url = makeid(6);
	console.log('url', url)

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
				sql.query(query)
			)
		});
		Promise.all(promiseList)
			.then(callback(null, url))
			.catch(e => callback(e))
	}

}


exports.getDates = function (url, userId, callback) {
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
				text: `SELECT * FROM public."Date" WHERE "MeetingId" = $1;`,
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
				text: `SELECT * FROM public."Meeting" WHERE "MeetingId" = $1;`,
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
				text: `SELECT "SignedUserId" FROM public."User" WHERE "UserId" = $1;`,
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
				text: `SELECT "UserName" FROM public."Signed User" WHERE "SignedUserId" = $1;`,
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
			text: `SELECT * FROM public."Vote" WHERE "MeetingId" = $1;`,
			values: [meetingId],
		}
	
		  sql.query(query, (err, res) => {
			if (err) {
				console.log(err.stack)
				callback(err.stack)
			}
			else {

				const userIds = []
				res.rows.forEach((el) => {
					userIds.push(el.UserIdVote)
				})
				userIds.push(userId)
				let uniqueIds = [...new Set(userIds)];
				let userIdToName;

				getNamesById(uniqueIds, (err, result) => {
					if (err) {
						callback(err);
					}
					userIdToName = result
					const votes = [];

					res.rows.forEach((el) => {
						votes.push({
							UserIdVote : el.UserIdVote,
							VoteDateId : el.VoteDateId,
							Name : userIdToName[el.UserIdVote].name
						})
					})
					let userName = userIdToName[userId].name
					callback(null, data, votes, meetingInfo, userName)
				})
			}
		})
	})
	.catch(e => {
		console.error(e)
		callback(e)
	})

}


exports.addVotes = function (url, votes, userId, callback) {
	// console.log(newData)

	let meetingId;

	// const promiseList;

	new Promise( (resolve) => {
		getMeetingIdFromUrl(url, (err, result) => {
			if (err) {
				callback(err);
			}
			meetingId = result.rows[0].MeetingId
			resolve()
		})
	})
	.then( () => {
		return new Promise((resolve) => {
			const query = {
				text: `DELETE FROM public."Vote" WHERE "MeetingId" = $1 AND "UserIdVote" = $2;`,
				values: [meetingId,userId],
			}
		
			sql.query(query, (err, res) => {
				if (err) {
					console.log(err.stack)
					callback(err.stack)
				}
				else {
					resolve()
				}
			})
		})
	})
	.then( () => {
		const promiseList = []
		votes.forEach(el => {
			const query = {
				text: `INSERT INTO public."Vote" \
				("MeetingId", "UserIdVote", "VoteDateId") VALUES
				($1, $2, $3);`,
				values: [meetingId, userId, el],
				}
			promiseList.push(
				sql.query(query)
			)
		})
		Promise.all(promiseList)
			.then(callback(null))
			.catch(e => {
				console.error(e)
				callback(e)
			})
	})
	.catch(e => {
		console.error(e)
		callback(e)
	})

}
