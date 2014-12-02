var express = require('express');
var router = express.Router();

router.post('/send', function(req, res) {
	var db = req.db;
	var thisTimestamp = Date.now();
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	
	db.collection('data').insert({sender : ip, receiver : req.body.receiver, data : req.body.data, timestamp : thisTimestamp, read : '0' }, function(err, result){
        res.send((err === null) ? { msg: '' } : { msg: err });
    });
});

//register/write a user into the database
router.post('/register', function(req, res) {
	var db = req.db;
	var thisTimestamp = Date.now();
	
	db.collection('userlist').update({number : req.body.number}, {number : req.body.number, timestamp : thisTimestamp }, {upsert: true }, function(err, result){
        res.send((err === null) ? { msg: '' } : { msg: err });
    });
});

//gives back all user
router.post('/getAllUser', function(req, res) {
	var db = req.db;
	
	db.collection('userlist').find().toArray(function (err, result) {
		res.send(result);
	});
});

//Gives back all data/messages
router.post('/getAllMessages', function(req, res) {
	var db = req.db;
	
	db.collection('data').find().toArray(function (err, result) {
		res.send(result);
	});
});

//get data to receive
router.post('/getMessages', function(req, res) {
	var db = req.db;
	//finds data sended to this user
	db.collection('data').find({ receiver : req.body.number, read : '0' }).toArray(function (err, result) {
			res.send(result);
			//updates this data 
			var searchData;
			var ObjectID = require('mongodb').ObjectID;
			for(var i=0; i<result.length; i++){
			searchData = ObjectID.createFromHexString(String(result[i]._id));
			db.collection('data').update({ _id : searchData }, {sender : result[i].sender, receiver : result[i].receiver, data : result[i].data, timestamp : result[i].timestamp, read : '1' }, function (err, result) {
			});
			}
		});
});

//get data user send to check if it was read
router.post('/getReadMessages', function(req, res) {
	var db = req.db;
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	db.collection('data').find({ sender : ip, read : '1'  }).toArray(function (err, result) {
		res.send(result);
		var delData;
		var ObjectID = require('mongodb').ObjectID;
		for(var i=0; i<result.length; i++){
			delData = ObjectID.createFromHexString(String(result[i]._id));
			db.collection('data').remove({_id : delData}, function(err, result) {
			});
		}
	});
});


router.post('/deleteMessage', function(req, res) {
	//VARIABLES
    var db = req.db;
	var ObjectId = require('mongodb').ObjectID;
	
	//removes the user(by macAdress)
    db.collection('data').remove({_id : ObjectId(req.body._id)}, function(err, result) {
		res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

router.post('/deleteUser', function(req, res) {
	//VARIABLES
    var db = req.db;
	var ObjectId = require('mongodb').ObjectID;
	
	//removes the user(by macAdress)
    db.collection('userlist').remove({_id : ObjectId(req.body._id)}, function(err, result) {
		res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});
module.exports = router;