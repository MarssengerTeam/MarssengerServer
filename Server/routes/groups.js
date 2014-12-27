var express = require('express');
var router = express.Router();


//create a group
router.post('/createGroup', function(req, res) {
	var db = req.db;

	var myGroupName = req.body.groupName;
	//example getting some errors, because not found?!
	var myMember = [
    {"phoneNumber":req.body.member[0].phoneNumber, "GCMCode": req.body.member[0].GCMCode}, 
    {"phoneNumber":req.body.member[1].phoneNumber, "GCMCode":  req.body.member[1].GCMCode}, 
    {"phoneNumber":req.body.member[2].phoneNumber,  "GCMCode": req.body.member[2].GCMCode}
	];

	
	
	
	db.collection('groups').insert({groupName : myGroupName, member : myMember}, {upsert: true }, function(err, result){
		res.send(result);
	});
});

//sends all the groupdata
router.post('/getAllGroups', function(req, res) {
	var db = req.db;
	db.collection('groups').find().toArray(function (err, result) {
		res.send(result);
	});
});

//sends all the groupdata
router.post('/getGroup', function(req, res) {
	var db = req.db;
	var ObjectID = require('mongodb').ObjectID;
	var myID = ObjectID(req.body._id);
	db.collection('groups').find({ _id : myID }).toArray(function (err, result) {
		res.send(result);
	});
});

//add a Member to the group
router.post('/addMember', function(req, res) {
	var db = req.db;
});

//delete a member from the group
router.post('/deleteMember', function(req, res) {
	var db = req.db;
	var ObjectID = require('mongodb').ObjectID;
	var myID = ObjectID(req.body._id);
	var myPhoneNumber = req.body.phoneNumber;
	var newMember = [];
	
	db.collection('groups').find({ _id : myID }).toArray(function (err, result) {
		for(var i=0; i< result[0].member.length; i++){
			if(result[0].member[i].phoneNumber == myPhoneNumber){
				result[0].member.splice(i, 1);
			}
		}
		
	});
});

//set NameGroup
router.post('/setName', function(req, res) {
	var db = req.db;
});

//set the Description of the group
router.post('/setDescription', function(req, res) {
	var db = req.db;
});

//set the picture of the group
router.post('/setPicture', function(req, res) {
	var db = req.db;
});

router.post('/deleteGroup', function(req, res) {
	//VARIABLES
    var db = req.db;
	var ObjectId = require('mongodb').ObjectID;
	
	//removes the user(by macAdress)
    db.collection('groups').remove({_id : ObjectId(req.body._id)}, function(err, result) {
		res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;