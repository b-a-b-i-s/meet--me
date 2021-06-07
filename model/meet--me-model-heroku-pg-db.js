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


exports.addMeeting = function (newData, loggedUserId, callback) {
 	// console.log('addong to db', newData)

	let url = makeid(6);
	let userId;
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

	// function findUserId() {
	// 	const query = {
	// 		text: `SELECT "UserId" FROM public."User" WHERE "SignedUserId" = ($1);`,
	// 		values: [loggedUserId],
	// 	}
	
	// 	sql.query(query, (err, res) => {
	// 		if (err)
	// 			callback(err.stack, null);
	// 		else {
	// 			userId = res.rows[0].UserId
	// 			createMeeting();
	// 		}
	// 	})
	// }

	function createMeeting(){
		const query = {
			text: `INSERT INTO public."Meeting" \
			("MeetingState", "MeetingTitle", "MeetingDescription", "MeetingDateCreated", \
			"MeetingSingleVote", "MeetingUrl","MeetingCreator") \
			VALUES	('open', $1, $2, CURRENT_TIMESTAMP, $3, $4, $5) RETURNING "MeetingId";`,
			values: [newData.name, newData.description, newData.oneVote, url, loggedUserId],
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


exports.getDates = function (req, callback) {
	// console.log(url)url, userId
	const url = req.params.url 
	const userId = req.session.userId

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
	// .then( (MeetingCreatorId) => {
	// 	return new Promise((resolve) => {
	// 		const query = {
	// 			text: `SELECT "SignedUserId" FROM public."User" WHERE "UserId" = $1;`,
	// 			values: [MeetingCreatorId],
	// 		}
		
	// 		sql.query(query, (err, res) => {
	// 			if (err) {
	// 				console.log(err.stack)
	// 				callback(err.stack)
	// 			}
	// 			else {
	// 				// res()
	// 				resolve(res.rows[0].SignedUserId)
	// 				// callback(null, data, votes)
	// 			}
	// 		})
	// 	})
	// })
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


exports.addVotes = function (req, callback) {
	const url = req.params.url;
	const votes = req.body;
	const name = req.params.name;
	const userId = req.session.userId;
	// console.log(newData)

	let meetingId;

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
			let query;
			if (req.session.loggedUserName) {
				query = {
					text: `UPDATE "Signed User" \
					SET "UserName" = $1 \
					WHERE "SignedUserId" = $2;`,
					values: [name, req.session.loggedUserId],
				}
			}
			else {
				query = {
					text: `UPDATE "Temporary User" \
					SET "TempName" = $1 \
					WHERE "TempId" = $2;`,
					values: [name, req.session.tempUserId],
				}
			}
			sql.query(query, (err, res) => {
				if (err) {
					console.log(err.stack)
					callback(err.stack)
				}
				else {
					resolve()
					// callback(null, data, votes)
				}
			})
		})
	})
	.then( () => {
		return new Promise((resolve) => {
			const query = {
				text: `SELECT "MeetingSingleVote" FROM public."Meeting" WHERE "MeetingId" = $1;`,
				values: [meetingId],
			}
		
			sql.query(query, (err, res) => {
				if (err) {
					console.log(err.stack)
					callback(err.stack)
				}
				else {
					if ((votes.length > 1) && (res.rows[0].MeetingSingleVote)) callback(null, true)
					resolve()
					// callback(null, data, votes)
				}
			})
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


exports.checkIfClosedAndIfUserIsCreator = function(req, callback) {
	const url = req.params.url;
	const loggedUserId = req.session.loggedUserId;
	
	const query = {
		text: `SELECT * FROM public."Meeting" WHERE "MeetingUrl" = $1;`,
		values: [url],
	}

	sql.query(query, (err, res) => {
		if (err) {
			console.log(err.stack)
			callback(err.stack)
		}
		else {
			const closed = res.rows[0].MeetingState != 'open';
			const check = res.rows[0].MeetingCreator == loggedUserId;
			callback(null, closed, check)
		}
	})

}


exports.chooseFinalOption = function(req, callback) {
	
	const url = req.params.url;

	const dateId = req.body[0]

	const query = {
		text: `UPDATE "Meeting" \
			SET "MeetingState" = $1 \
			WHERE "MeetingUrl" = $2;`,
		values: [`'${dateId}'`,url],
	}

	sql.query(query, (err, res) => {
		if (err) {
			console.log(err.stack)
			callback(err.stack)
		}
		else {
			callback(null)
		}
	})
}
















//// LOGIN REGISTER ////


function getUserNames(username, callback) {

	const query = {
		text: `SELECT * FROM "public"."Signed User" WHERE "UserEmail"=$1;`,
		values: [username]
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
// Επιστρέφει τον χρήστη με όνομα 'username'
exports.getUserByUsername = (username, callback) => {

	getUserNames(username, callbackFunction);
	
	function callbackFunction(err, res) {
		let user;
		if (err) {
			callback(err);
		}
		if (res.rowCount == 0){
			console.log("No such user exists")
			callback(null)
		}
		else {
			user = { id: res.rows[0].SignedUserId, useremail: res.rows[0].UserEmail, username: res.rows[0].UserName, password: res.rows[0].UserPassword };
			const query = {
				text: `SELECT "UserId" FROM public."User" WHERE "SignedUserId"=$1;`,
				values: [user.id]
			}
		
			sql.query(query, (err, res) => {
				if (err) {
					console.log(err.stack)
					callback(err.stack)
				}
				else {
					user.userId = res.rows[0].UserId
					callback(null, user)
		
				}
			})
		}
		
	} 

}
function addNewUser(userfullname, email, password, callback) {

	const query = {
		text: `INSERT INTO "public"."Signed User" ("UserName", "UserEmail", "UserPassword") VALUES
		($1, $2, $3);`,
		values: [userfullname, email, password]
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
exports.registerUser = function (username, email, password, callback) {
    // ελέγχουμε αν υπάρχει χρήστης με αυτό το username
    exports.getUserByUsername(email, async (err, user) => {
        if (user != undefined) {
            callback(null, null, { message: "Υπάρχει ήδη χρήστης με αυτό το όνομα" })
        } else {
            try {
                const hashedPassword = await bcrypt.hash(password, 10);
				addNewUser(username, email, hashedPassword, callbackFunction)
				function callbackFunction(err, res) {
					let user;
					if (err) {
						callback(err);
					}
					callback(null,res);
				}

            } catch (error) {
                callback(error);
            }
        }
    })
}

exports.addTempUser = function(req, callback) {

	let user = {}

	const query = {
		text: `INSERT INTO public."Temporary User" ("TempName") 
		VALUES('') RETURNING "TempId";`
	}

	  sql.query(query, (err, res) => {
		if (err) {
			console.log(err.stack)
			callback(err.stack)
		}
		else {
			user.id = res.rows[0].TempId;
			user.tempName = '';
			getId(res.rows[0].TempId)
			
		}
	})

	function getId(TempId) {
		const query = {
			text: `SELECT "UserId" FROM public."User" WHERE "TempId" = $1;`,
			values: [TempId]
		}
	
		  sql.query(query, (err, res) => {
			if (err) {
				console.log(err.stack)
				callback(err.stack)
			}
			else {
				user.userId = res.rows[0].UserId;
				callback(null, user)
			}
		})
	}
}


// function getUserId(signeduserid, callback) {

// 	const query = {
// 		text: `SELECT * FROM "public"."User" WHERE "SignedUserId"=$1;`,
// 		values: [signeduserid]
// 	}

// 	  sql.query(query, (err, res) => {
// 		if (err) {
// 			console.log(err.stack)
// 			callback(err.stack)
// 		}
// 		else {
// 			callback(null, res)

// 		}
// 	})
// }

function getCreatedMeetings(signeduserid, callback) {

	const query = {
		text: `SELECT * FROM "public"."Meeting" WHERE "MeetingCreator"=$1;`,
		values: [signeduserid]
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

function getnumofvotes(meetid, callback){
	const query = {
		text: `SELECT COUNT(DISTINCT "Vote"."UserIdVote") FROM "public"."Vote" WHERE "Vote"."MeetingId"=$1;`,
		values: [meetid]
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

function getchosendate(meetid, dateid, callback){
	const query = {
		text: `SELECT "StartDate" FROM "Date" WHERE "MeetingId"=$1 AND "DateId"=$2;`,
		values: [meetid, parseInt(dateid.substr(1,dateid.length),10)]
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

exports.showMyMeetings = function (req, callback) {
	// console.log(req.session)
    // console.log("🚀 ~ file: meet--me-model-heroku-pg-db.js ~ line 790 ~ req.session.loggedUserId", req.session.loggedUserId)

	const userid = req.session.loggedUserId



			let meetings =[];

			getCreatedMeetings(userid, clbfc);

			async function clbfc(err, res){
				if(err){
					callback(err)
				}
				else{
					const promiseList = []
					for(let i in res.rows){

							console.log("asas",res.rows[i])
							let numofparts;
							promiseList.push ( new Promise((resolve, rej) =>{
								
								getnumofvotes(res.rows[i].MeetingId, callfunc)
								function callfunc(err, rescounts){
									if(err){
										callback(err)
									}
									else{
										numofparts = rescounts.rows[0].count;
										if(res.rows[i].MeetingState!="open"){
											getchosendate(res.rows[i].MeetingId, res.rows[i].MeetingState, callbackfuncdate);
											function callbackfuncdate(errdate, resdate){
												if(errdate){
													callback(errdate)
												}
												else{
													let chosendate = resdate.rows[0].StartDate
													meetings.push({closed: true, meetingTitle: res.rows[i].MeetingTitle, meetingDescription: res.rows[i].MeetingDescription, meetingDateCreated: res.rows[i].MeetingDateCreated, meetingUrl: res.rows[i].MeetingUrl, numberOfParticipants: numofparts, finalDate: chosendate.toLocaleString("en-GB",{}).replace(',',''), name:req.session.loggedUserName})
													resolve()
													// callback(null,meetings)
												}
											}
										}
										else{
											meetings.push({closed: false, meetingTitle: res.rows[i].MeetingTitle, meetingDescription: res.rows[i].MeetingDescription, meetingDateCreated: res.rows[i].MeetingDateCreated, meetingUrl: res.rows[i].MeetingUrl, numberOfParticipants: numofparts, name:req.session.loggedUserName})
											resolve()
											// callback(null,meetings)
										}
				
									}
		
								}
							}))
							
					}

					Promise.all(promiseList)
						.then( () => {
							console.log('meetings', meetings)
							callback(null,meetings)
						})
						.catch(e => {
							console.log(e)
							callback(e)
						})
			


					
					
					

				}
			}
		

	

}