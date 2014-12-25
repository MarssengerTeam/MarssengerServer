var express = require('express');
var router = express.Router();


//create a group
router.post('/createGroup', function(req, res) {
	var db = req.db;

	var myGroupName = req.body.groupName;
	//example
	var myMember = [
    {"phoneNumber":"John", "GCMCode":"Doe"}, 
    {"phoneNumber":"Anna", "GCMCode":"Smith"}, 
    {"phoneNumber":"Peter", "GCMCode": "Jones"}
	];
	var myMember = req.body.member;

	
	
	
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

module.exports = router;