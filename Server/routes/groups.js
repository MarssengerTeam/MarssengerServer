var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;


//create a group
router.post('/createGroup', function(req, res) {
	var db = req.db;
	var memberData = [];
	var myMember = '';
	
	//GroupName
	if(req.body.groupName != null && req.body.groupName != ""){
			var myGroupName = req.body.groupName;
	}else{
		res.send({ error: "2" });
		return;
	}
	
	if(req.body.member != ""){
		myMember = JSON.parse(req.body.member);
		console.log("INPUT: " + JSON.stringify(myMember));
	}else{
		res.send({ error: "2" });
		return;
	}
	
	console.log("SearchData: " + JSON.stringify(memberData));
	db.collection('groups').insert({groupName : myGroupName, member : myMember}, {upsert: true }, function(err, result){
		res.send(result);
	});
});

//gets all the gcm codes of all members
router.post('/getGCMCodesOfMembers', function(req, res) {
	var db = req.db;
	var myPhoneNumber = req.body.phoneNumber;
	
	db.collection('groups').find({ phoneNumber : myPhoneNumber }).toArray(function (err, result) {
		var sendData = [];
		for(var i=0; i<result.length; i++){
			sendData.push({ 'GCMCode' : result[i].GCMCode });
		}	
		res.send(JSON.stringify(sendData));
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
	var myID = ObjectID(req.body._id);
	
	db.collection('groups').find({ _id : myID }).toArray(function (err, result) {
		res.send(result);
	});
});

//add a Member to the group
router.post('/addMember', function(req, res) {
	var db = req.db;
	var memberData = [];
	var searchData = [];
	var myMember = '';
	
	//GroupName
	if(req.body.groupID != null && req.body.groupID != ""){
			var myID = ObjectID.createFromHexString(String(req.body.groupID));
			console.log(myID);
	}else{
		res.send({ error: "2" });
		return;
	}
	
	if(req.body.member != ""){
		myMember = JSON.parse(req.body.member);
		
	}else{
		res.send({ error: "2" });
		return;
	}
	
	db.collection('groups').update( { _id : myID }, { $push: { member : myMember }}, {multi : true},function (err, resultFind) {;
		res.sendStatus(200);
	});
});

  

//delete a member from the group
router.post('/deleteMember', function(req, res) {
	var memberData = [];
	var newMemberData = [];
	var searchData = [];
	var myMember = '';
	var db = req.db;
	
	//GroupID
	if(req.body.groupID != null && req.body.groupID != ""){
			var myID = ObjectID.createFromHexString(String(req.body.groupID));
			console.log(myID);
	}else{
		res.send({ error: "2" });
		return;
	}
	
	if(req.body.member != ""){
		myMember = JSON.parse(req.body.member);
	}else{
		res.send({ error: "2" });
		return;
	}
	
	db.collection('groups').update({_id : myID},{ $pull: { member : myMember }}, function(err, resultUpdate){
			res.sendStatus(200);
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