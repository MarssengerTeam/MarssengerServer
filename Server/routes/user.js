var express = require('express');
var router = express.Router();

//register/write a user into the database
router.post('/register', function(req, res) {
	var db = req.db;
	var ObjectId = require('mongodb').ObjectID;
	
	var thisTimestamp = Date.now();
	var myPhoneNumber = req.body.phoneNumber;
	var myEMail = req.body.eMail;
	var myGCMCode = req.body.GCMCode;
	var myDigitCode = req.body.digitCode;
	
	db.collection('user').find({ phoneNumber : myPhoneNumber }).toArray(function (err, resultFind) {
		if(resultFind.toString() == ""){
			db.collection('user').insert({phoneNumber : myPhoneNumber, GCMCode : myGCMCode, DigitCode : myDigitCode, eMail : myEMail, lastTimeActive : thisTimestamp, status : "1"}, {upsert: true }, function(err, resultArray){
			db.collection('userStatistics').insert({ idOwner : resultArray[0]._id, accountCreated : thisTimestamp, messagesRecieved : '0', messagesSend : '0'}, {upsert: true }, function(err, resultCollections){
			});
			res.send(resultArray);
		});
		}
		else{
			res.send("This phoneNumber is already in use!")
		}
	});
	
	
	//TWILIO
	/*//require the Twilio module and create a REST client
	var client = require('twilio')('AC443997feb26db0b7dcf8373bc43c36ff', '8ffeb781fb0b996a240056d920142c35');

	//Send an SMS text message
	client.sendMessage({

    to:'+491727500917', // Any number Twilio can deliver to
    from: '+19282375941', // A number you bought from Twilio and can use for outbound communication
    body: 'Please verify into Marssenger. Enter ' + myVerificationCode + ' into the App' // body of the SMS message

	},function(error, message) {
		// This callback is executed when the request completes
		if (error) {
			console.error('Dagnabit.  We couldn\'t send the message');
			console.error(error);
		} else {
			console.log('Message sent! Message id: '+message.sid);
		}
	});	*/
});

/*
router.post('/verify', function(req, res) {
 var db = req.db;
	var myID = req.body.id;
	
	db.collection('user').find( { _id : myID  } ).toArray(function (err, result) {
	
		var thisTimestamp = Date.now();

		db.collection('user').update({ _id : myID }, {$set : {lastTimeActive : thisTimestamp, status : "verified"}}, {upsert: true }, function(err, result){
			res.send((err === null) ? { msg: '' } : { msg: err });
		});
	});
});*/

//gives back user statistics
router.post('/getUserStatistics', function(req, res) {
	var db = req.db;
	var ObjectID = require('mongodb').ObjectID;
	
	searchData = ObjectID.createFromHexString(String(req.body._id));
	db.collection('userStatistics').find({  idOwner : searchData}).toArray(function (err, result) {
		res.send(result);
	});
});

//gives back user
router.post('/getUser', function(req, res) {
	var db = req.db;
	var phoneNumber = req.body.phoneNumber;
	
	db.collection('user').find({  phoneNumber : phoneNumber }).toArray(function (err, result) {
		res.send(result);
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
	var ObjectId = require('mongodb').ObjectID;
	
	//removes the user(by macAdress)
    db.collection('user').remove({_id : ObjectId(req.body._id)}, function(err, result) {
    });
	db.collection('userStatistics').remove({_id : ObjectId(req.body._id)}, function(err, result) {
		res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;