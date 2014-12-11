var express = require('express');
var router = express.Router();

//create a group
router.post('/createGroup', function(req, res) {
	var db = req.db;

	var myGroupName = req.body.groupName;
	var member = [];
	member = req.body.member;
	memberArray = member.split('&');
	var myMember = "{";
	for(var i=0; i < memberArray.length; i++){
		myMember += memberArray[i] + "}";
		if(i != memberArray[i]){
		myMember += ", {";
		
		}
	}
	
	
	db.collection('groups').insert({groupName : myGroupName, member : myMember}, {upsert: true }, function(err, result){
	});
});

//sends all the groupdata
router.post('/getGroup', function(req, res) {
	var db = req.db;
});

//add a Member to the group
router.post('/addMember', function(req, res) {
	var db = req.db;
});

//delete a member from the group
router.post('/deleteMember', function(req, res) {
	var db = req.db;
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