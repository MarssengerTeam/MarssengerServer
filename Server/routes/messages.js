var express = require('express');
var router = express.Router();
var gcm = require('node-gcm');
var request = require('request');

router.post('/addMessage', function(req, res) {
	var db = req.db;
	var thisTimestamp = Date.now();
	var ObjectId = require('mongodb').ObjectID;
	
	//SEND DATA
	var myMessageID = req.body.messageID;
	var mySender = req.body.sender;
	var myReceiver = req.body.receiver;
	var myData = req.body.data;

	db.collection('user').find({ phoneNumber : mySender }).toArray(function (err, resultSender) {
		db.collection('user').find({ phoneNumber : myReceiver }).toArray(function (err, resultReceiver) {
			if(resultSender.toString() != "" || resultReceiver.toString() != ""){
				db.collection('messages').insert({messageID : myMessageID, sender : resultSender[0].phoneNumber, receiver  : resultReceiver[0].phoneNumber, receiverGCM : resultReceiver[0].GCMCode, data : myData, timestamp : thisTimestamp, read : '0' }, function(err, result){
					res.send((err === null) ?  result  : { error: err });
					
				
		
					var message = new gcm.Message({
						collapseKey: 'message',
						delayWhileIdle: false,
						timeToLive: 5000,
						data: {
							messageTyp : "1",
							MessageID : result[0].messageID
						}
					});
					console.log(message);
					var sender = new gcm.Sender('AIzaSyCQau4uiNPEC909ExmGL8gwIj9XHgPPq4g');
					var registrationIds = [];

					// At least one required
					registrationIds.push(result[0].receiverGCM);

					sender.send(message, registrationIds, 4, function (err, result) {
						console.log(err);
						console.log(result);
					});
				});
			}
			else{
				res.send("Could't find phoneNumber of Receiver");
			}
		});
	});
});

//Gives back all data/messages
router.post('/messageRead', function(req, res) {
	var db = req.db;
	
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
			db.collection('messages').update({ _id : searchData }, {$set: { read : '1' } }, function (err, result) {
			
					var message = new gcm.Message({
						collapseKey: 'message',
						delayWhileIdle: false,
						timeToLive: 5000,
						data: {
							messageTyp : "2",
							MessageID : result[0].messageID
						}
					});
					console.log(message);
					var sender = new gcm.Sender('AIzaSyCQau4uiNPEC909ExmGL8gwIj9XHgPPq4g');
					var registrationIds = [];

					// At least one required
					registrationIds.push(result[0].senderGCM);

					sender.send(message, registrationIds, 4, function (err, result) {
						console.log(err);
						console.log(result);
					});
			
			});
			}
		});
});

//get data user send to check if it was read
router.post('/getReadMessages', function(req, res) {
	var db = req.db;
	db.collection('messages').find({ sender : req.body.sender, read : '1'  }).toArray(function (err, result) {
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

module.exports = router;