var express = require('express');
var router = express.Router();

router.post('/send', function(req, res) {
	var db = req.db;
	var thisTimestamp = Date.now();
	
	db.collection('data').insert({sender : req.body.sender, receiver : req.body.receiver, data : req.body.data, timestamp : thisTimestamp, read : '0' }, function(err, result){
        res.send((err === null) ? { msg: '' } : { msg: err });
    });
});

router.post('/register', function(req, res) {
	var db = req.db;
	var thisTimestamp = Date.now();
	
	db.collection('userlist').update({number : req.body.number}, {number : req.body.number, timestamp : thisTimestamp }, {upsert: true }, function(err, result){
        res.send((err === null) ? { msg: '' } : { msg: err });
    });
});

router.post('/get', function(req, res) {
	var db = req.db;
	var requesttyp = req.body.reqtyp;
	
	//Gives back user
	if(requesttyp === '0'){
		db.collection('userlist').find().toArray(function (err, result) {
			res.send(result);
		});
	}
	
	//Gives back data
	if(requesttyp === '1'){
		db.collection('data').find().toArray(function (err, result) {
			res.send(result);
		});
	}
	
	if(requesttyp === '2'){
		db.collection('data').find({ receiver : req.body.number, read : '0' }).toArray(function (err, result) {
			res.send(result);
			var searchData;
			var ObjectID = require('mongodb').ObjectID;
			for(var i=0; i<result.length; i++){
			searchData = ObjectID.createFromHexString(String(result[i]._id));
			db.collection('data').update({ _id : searchData }, {sender : result[i].sender, receiver : result[i].receiver, data : result[i].data, timestamp : result[i].timestamp, read : '1' }, function (err, result) {
			});
			}
		});
	}
	
	if(requesttyp === '3'){
		db.collection('data').find({ sender : req.body.number, read : '1'  }).toArray(function (err, result) {
			res.send(result);
			var delData;
			var ObjectID = require('mongodb').ObjectID;
			for(var i=0; i<result.length; i++){
			delData = ObjectID.createFromHexString(String(result[i]._id));
			db.collection('data').remove({_id : delData}, function(err, result) {
			});
			}
		});
	}
});
/*
router.post('/confirm', function(req, res) {
	var db = req.db;
	var ObjectId = require('mongodb').ObjectID;
	db.collection('data').find({ _id : ObjectID(req.body.id) }).toArray(function (err, result) {
		if(result === ''){
			res.send('ERROR');
		}
		else{
			var ObjectId = require('mongodb').ObjectID;
			var thisTimestamp = Date.now();
			db.collection('data').update({_id : ObjectId(result[0]._id)}, {sender : result[0].sender, receiver : result[0].receiver, data : result[0].data, timestamp : thisTimestamp, read : '1' }, function(err, result){
			});
		}
	});
});

router.post('/isConfirmed', function(req, res) {
	var db = req.db;
	db.collection('data').find({ sender : req.body.sender, read : '1' }).toArray(function (err, result) {
		res.send(result);
	});
});*/

router.post('/delete', function(req, res) {
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