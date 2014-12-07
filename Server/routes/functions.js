var express = require('express');
var router = express.Router();
var gcm = require('node-gcm');

router.post('/send', function(req, res) {
	var db = req.db;
	var thisTimestamp = Date.now();
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	
	db.collection('').insert({sender : ip, receiver : req.body.receiver, data : req.body.data, timestamp : thisTimestamp, read : '0' }, function(err, result){
        res.send((err === null) ? { msg: '' } : { msg: err });
    });
	
	// or with object values
	var message = new gcm.Message({
		collapseKey: 'demo',
		delayWhileIdle: true,
		timeToLive: 3,
		data: {
			key1: 'message1',
			key2: 'message2'
		}
	});

	var sender = new gcm.Sender('AIzaSyCQau4uiNPEC909ExmGL8gwIj9XHgPPq4g');
	var registrationIds = [];

	// At least one required
	registrationIds.push("APA91bF40HFSoQ2HX95EkNgGez9_N40Wvdc6OzMgPa9MArS6uSip6cgE_dCKPstRhKfrQsXP0oZmHkK58tWjDFQHtRuEr-YQDoGDv-W2ZJ9PDgGyWqBBNevQMqKqbbsVEag73RUDJxVgcktxa0eowx705Qu_iTVvdw");

	/**
	* Params: message-literal, registrationIds-array, No. of retries, callback-function
	**/
	sender.send(message, registrationIds, 4, function (err, result) {
		console.log(result);
	});
});

//register/write a user into the database
router.post('/register', function(req, res) {
	var db = req.db;
	var ObjectId = require('mongodb').ObjectID;
	
	var thisTimestamp = Date.now();
	var myPhoneNumber = req.body.phoneNumber;
	var myEMail = req.body.eMail;
	var myVerificationCode = "123";
	
	db.collection('user').insert({phoneNumber : myPhoneNumber, eMail : myEMail, lastTimeActive : thisTimestamp, status : "not verified", verificationCode : myVerificationCode}, {upsert: true }, function(err, result){
	db.collection('user').find({phoneNumber : myPhoneNumber}).toArray(function (err, resultArray) {	
	console.log(resultArray)
	db.collection('userStatistics').insert({ idOwner : resultArray[0]._id, accountCreated : thisTimestamp, messagesRecieved : '0', messagesSend : '0'}, {upsert: true }, function(err, results){
    });
	res.send(resultArray);
	});
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

router.post('/verify', function(req, res) {
 var db = req.db;
	var myID = req.body.id;
	
	db.collection('user').find( { _id : myID  } ).toArray(function (err, result) {
	
		var thisTimestamp = Date.now();

		db.collection('user').update({ _id : myID }, {$set : {lastTimeActive : thisTimestamp, status : "verified"}}, {upsert: true }, function(err, result){
			res.send((err === null) ? { msg: '' } : { msg: err });
		});
	});
});

//gives back all user
router.post('/getUserStatistics', function(req, res) {
	var db = req.db;
	var ObjectID = require('mongodb').ObjectID;
	console.log(req.body._id);
	searchData = ObjectID.createFromHexString(String(req.body._id));
	db.collection('userStatistics').find({  idOwner : searchData}).toArray(function (err, result) {
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

//Gives back all data/messages
router.post('/getAllMessages', function(req, res) {
	var db = req.db;
	
	
	db.collection('messages').find().toArray(function (err, result) {
		res.send(result);
	});
});

//get data to receive
router.post('/getMessages', function(req, res) {
	var db = req.db;
	//finds data sended to this user
	db.collection('messages').find({ receiver : req.body.number, read : '0' }).toArray(function (err, result) {
			res.send(result);
			//updates this data 
			var searchData;
			var ObjectID = require('mongodb').ObjectID;
			for(var i=0; i<result.length; i++){
			searchData = ObjectID.createFromHexString(String(result[i]._id));
			db.collection('messages').update({ _id : searchData }, {sender : result[i].sender, receiver : result[i].receiver, data : result[i].data, timestamp : result[i].timestamp, read : '1' }, function (err, result) {
			});
			}
		});
});

//get data user send to check if it was read
router.post('/getReadMessages', function(req, res) {
	var db = req.db;
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	db.collection('messages').find({ sender : ip, read : '1'  }).toArray(function (err, result) {
		res.send(result);
		var delData;
		var ObjectID = require('mongodb').ObjectID;
		for(var i=0; i<result.length; i++){
			delData = ObjectID.createFromHexString(String(result[i]._id));
			db.collection('messages').remove({_id : delData}, function(err, result) {
			});
		}
	});
});


router.post('/deleteMessage', function(req, res) {
	//VARIABLES
    var db = req.db;
	var ObjectId = require('mongodb').ObjectID;
	
	//removes the user(by macAdress)
    db.collection('messages').remove({_id : ObjectId(req.body._id)}, function(err, result) {
		res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
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