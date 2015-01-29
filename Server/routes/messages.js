var express = require('express');
var router = express.Router();
var gcm = require('node-gcm');
var request = require('request');
var ObjectID = require('mongodb').ObjectID;

router.post('/deleteAll', function(req, res){
	var db = req.db;
	db.collection('messages').drop();
	res.send();
});

router.post('/addMessage', function(req, res) {
	var db = req.db;
	var thisTimestamp = Date.now();
	
	//==================CHECK INPUT=============
	//messageID
	if(req.body.messageID != null && req.body.messageID != ""){
		var myMessageID = req.body.messageID;
	}else{
		res.send({ error: "2" });
		return;
	}
	
	//sender
	if(req.body.sender != null && req.body.sender != ""){
		var mySender = req.body.sender;
	}else{
		res.send({ error: "2" });
		return;
	}
	
	//data
	if(req.body.data != null && req.body.data != ""){
		var myData = req.body.data;
	}else{
		res.send({ error: "2" });
		return;
	}
	
	//receiver
	if(req.body.receiver != null && req.body.receiver){
		//single chat
		if(req.body.messageType == '1'){
			var myReceiver = '';
			var myReceiverGCM = '';
			var helpReceiver = req.body.receiver ;
			db.collection('user').find({ phoneNumber : helpReceiver }).toArray(function (err, resultReceiver) {
				myReceiverGCM = resultReceiver[0].GCMCode;
				myReceiver = resultReceiver[0].phoneNumber;
				sendData(myReceiver, myReceiverGCM);
			});
		}
		//group message
		if(req.body.messageType == '2'){
			var myReceiverGCM = [];
			var myReceiver = [];
			db.collection('groups').find({ _id : ObjectID.createFromHexString(String(req.body.receiver)) }).toArray(function (err, resultGroup) {
				console.log(resultGroup);
				var searchData = [];
				for(var i=0; i<resultGroup[0].member.length; i++){
					searchData.push({ '_id' : ObjectID.createFromHexString(String(resultGroup[0].member[i]._id)) });
				}
				console.log(JSON.stringify(searchData));
			db.collection('user').find({ $or : searchData }).toArray(function (err, result) {
				console.log(result);
				for(var i=0; i<result.length; i++){
					myReceiverGCM.push({ 'GCMCode' : result[i].GCMCode });
					myReceiver.push({ 'phoneNumber' : result[i].phoneNumber });
				}
			console.log(myReceiver);
			sendData(myReceiver, myReceiverGCM);
					
			});	
			});
		}

	}else{
		res.send({ error: "2" });
		return;
	}
	
	function sendData(myReceiver, myReceiverGCM){
		console.log(myReceiver);
		db.collection('user').find({ phoneNumber : mySender }).toArray(function (err, resultSender) {
			if(resultSender.toString() != ""){
				db.collection('messages').insert({messageID : myMessageID, sender : resultSender[0].phoneNumber, receiver  : myReceiver, receiverGCM : myReceiverGCM, data : myData, timestamp : thisTimestamp, read : '0' }, function(err, result){
					res.send(result);
					
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
					if(req.body.messageType == '2'){
					for(var i=0; i<myReceiverGCM.length; i++){
						registrationIds.push(myReceiverGCM[i].GCMCode);
					}
					}
					if(req.body.messageType == '1'){
						registrationIds.push(myReceiverGCM);
					}
					console.log(registrationIds);

					sender.send(message, registrationIds, 4, function (err, result) {
						console.log(err);
						console.log(result);
					});
				});
			}
			else{
				res.send("Could't find phoneNumber of Sender");
			}
		});
	}
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
				db.collection('messages').update({ _id : searchData }, {$set: { read : '1' } }, function (err, resultUpdate) {
				db.collection('messages').find({ _id : searchData  }).toArray(function (err, result) {
				if(result != null){
					console.log(result.toString());
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
				}
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
	var ObjectID = require('mongodb').ObjectID;
	
	//removes the user(by macAdress)
    db.collection('messages').remove({_id : ObjectID(req.body._id)}, function(err, result) {
		res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
