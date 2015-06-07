var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var uuid = require('node-uuid');

//register/write a user into the database
router.post('/register', function(req, res) {
	var db = req.db;
	//==================CHECK INPUT=============

	//phoneNumber
	if(req.body.phoneNumber != null && req.body.phoneNumber != ""){
		var myPhoneNumber = req.body.phoneNumber;
	}else{
		res.send({ error: "2" });
		return;
	}
	
	//Email
	var myEMail = req.body.eMail;
	
	//GCMCode
	if(req.body.GCMCode != null && req.body.GCMCode != ""){
		var myGCMCode = req.body.GCMCode;
	}else{
		res.send({ error: "4" });
		return;
	}
	
	//DigitCode
	if(req.body.digitCode != null && req.body.digitCode != ""){
		var myDigitCode = req.body.digitCode;
	}else{
		res.send({ error: "5" });
		return;
	}
	//==================CHECK INPUT=============
	
	//token
	var myToken = uuid.v1();
	
	//timestamp
	var thisTimestamp = Date.now();
	
	db.collection('user').find({ phoneNumber : myPhoneNumber }).toArray(function (err, resultFind) {
		if(resultFind.toString() == ''){
			db.collection('user').insert({phoneNumber : myPhoneNumber, GCMCode : myGCMCode, DigitCode : myDigitCode, eMail : myEMail, lastTimeActive : thisTimestamp, status : "1", token : myToken, tokenTimestamp : thisTimestamp }, {upsert: true }, function(err, resultArray){
				db.collection('userStatistics').insert({ idOwner : resultArray[0]._id, accountCreated : thisTimestamp, messagesRecieved : '0', messagesSend : '0'}, {upsert: true }, function(err, resultStatistics){
				});
				res.send(resultArray);
			});	
		}
		else{
			res.send({ error: "1" });
			return;
		}
	});
});



//Acquire an AuthToken for the authentification process argv(Phonenumber, GCMCode) // TODO Add cryptoIMEI as additional PW arg(Phonenumber, GCMCode, IMEI)
router.post('/getAuthTokenByPhonenumberAndGCMCode', function(req, res){
	var db = req.db;
	
	//PhoneNumber
	if(req.body.phoneNumber != null && req.body.phoneNumber != ""){
		var myPhoneNumber = req.body.phoneNumber;
	}else{
		res.send({ error: "6" });
		return;
	}
	//GCMCode
	if(req.body.GCMCode != null && req.body.GCMCode != ""){
		var myGCMCode = req.body.GCMCode;
	}else{
		res.send({ error: "7" });
		return;
	}
	var TTL = 86400000;
	//get old Token and time
	db.collection('user').find({ phoneNumber : myPhoneNumber, GCMCode : myGCMCode }).toArray(function (err, resultFind) {
		if(resultFind.toString() != ''){
				var myAuthToken = resultFind[0].token;
				var myTokenTimestamp =  resultFind[0].tokenTimestamp;
				
				if(myTokenTimestamp <= Date.now() - TTL){
					//token invalidated
					var myNewToken = uuid.v1();
					db.collection('user').update({ phoneNumber : myPhoneNumber }, {$set: { token : myNewToken, tokenTimestamp : Date.now()}}, function (err, result) {
						if(result != null && result != ""){
								res.send({token :myNewToken});
								return;
						}
					});
					
				} else{
					res.send({token : myAuthToken});
					return;
				}
		}
		else{
			res.send({ error: "1" });
			return;
		}
	});

});

router.post('/changePhoneNumber', function(req, res) {
	var db = req.db;
	
	//_ID
	if(req.body._id != null && req.body._id != ""){
		var myID = ObjectID.createFromHexString(String(req.body._id));
	}else{
		res.send({ error: "2" });
		return;
	}

	//phoneNumber
	if(req.body.phoneNumber != null && req.body.phoneNumber != ""){
		var myPhoneNumber = req.body.phoneNumber;
	}else{
		res.send({ error: "2" });
		return;
	}	
	
	db.collection('user').update({ _id : myID }, {$set: { phoneNumber : myPhoneNumber }}, function (err, result) {
				res.sendStatus(result);
	});
});

router.post('/changeGCMCode', function(req, res) {
	var db = req.db;
	
		//_ID
	if(req.body._id != null && req.body._id != ""){
		var myID = ObjectID.createFromHexString(String(req.body._id));
	}else{
		res.send({ error: "2" });
		return;
	}
	
	//GCMCode
	if(req.body.GCMCode != null && req.body.GCMCode != ""){
		var myGCMCode = req.body.GCMCode;
	}else{
		res.send({ error: "2" });
		return;
	}
	
	
	db.collection('user').update({ _id : myID }, {$set: { GCMCode : myGCMCode }}, function (err, result) {
				res.sendStatus(result);
	});
});

router.post('/changeDigitCode', function(req, res) {
	var db = req.db;
	
	//_ID
	if(req.body._id != null && req.body._id != ""){
		var myID = ObjectID.createFromHexString(String(req.body._id));
	}else{
		res.send({ error: "2" });
		return;
	}
	
	//digitCode
	if(req.body.digitCode != null && req.body.digitCode != ""){
		var myDigitCode = req.body.digitCode;
	}else{
		res.send({ error: "2" });
		return;
	}
	
	db.collection('user').update({ _id : myID }, {$set: { DigitCode : myDigitCode }}, function (err, result) {
				res.sendStatus(result);
	});
});

router.post('/changeEMail', function(req, res) {
	var db = req.db;
	
	//_ID
	if(req.body._id != null && req.body._id != ""){
		var myID = ObjectID.createFromHexString(String(req.body._id));
	}else{
		res.send({ error: "2" });
		return;
	}
	
	//phoneNumber
	if(req.body.eMail != null && req.body.eMail != ""){
		var myEMail = req.body.eMail;
	}else{
		res.send({ error: "2" });
		return;
	}
	
	
	db.collection('user').update({ _id : myID }, {$set: { eMail : myEMail  }}, function (err, result) {
				res.sendStatus(result);
	});
});

//gives back user statistics
router.post('/getUserStatistics', function(req, res) {
	var db = req.db;
	
	//_ID
	if(req.body._id != null && req.body._id != ""){
		var myID = ObjectID.createFromHexString(String(req.body._id));
	}else{
		res.send({ error: "2" });
		return;
	}
	
	db.collection('userStatistics').find({ idOwner : myID}).toArray(function (err, result) {
		res.send(result);
	});
});

//Looks up a user by his phoneNumber and GCMCode
router.post('/getUserByPhoneNumber', function(req, res){ 
	var db = req.db;
	//phoneNumber
	if(req.body.phoneNumber != null && req.body.phoneNumber != ""){
		var myPhoneNumber = req.body.phoneNumber;
	}else{
		res.send({ error: "2" });
		return;
	}
	
	db.collection('user').find({ phoneNumber : myPhoneNumber}).toArray(function (err, resultFind) {
		res.send(resultFind);
	});

});


//gives back all user
router.post('/getAllUser', function(req, res) {
	var db = req.db;
	
	db.collection('user').find().toArray(function (err, result) {
		res.send(result);
	});
});

router.post('/deleteUser', function(req, res) {
	//VARIABLES
    var db = req.db;
	
	//_ID
	if(req.body._id != null && req.body._id != ""){
		var myID = ObjectID.createFromHexString(String(req.body._id));
	}else{
		res.send({ error: "2" });
		return;
	}
	
	//removes the user
    db.collection('user').remove({_id : myID}, function(err, result) {
    });
	db.collection('userStatistics').remove({_id : myID}, function(err, result) {
		res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;