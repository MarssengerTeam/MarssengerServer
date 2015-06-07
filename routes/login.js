/**
 * Created by Nicolas on 29/12/2014.
 */
var express = require('express');
var router = express.Router();


//Representative Gateway? or Shard Manager inside here?

//handle incomming session @ this point

//arg(Phonenumber, localToken)      returns FAIL_TOKEN_OUTDATED || SUCCESS_TOKEN_VALIDATED
router.post('/loginWithToken', function(req, res){
	var db = req.db;
	
	//PhoneNumber
	if(req.body.phoneNumber != null && req.body.phoneNumber != ""){
		var myPhoneNumber = req.body.phoneNumber;
	}else{
		res.send({ error: "6" });
		return;
	}
	//AuthToken
	if(req.body.token != null && req.body.token != ""){
		var myAuthToken = req.body.token;
	}else{
		res.send({ error: "8" });
		return;
	}
	
	var isLegit = false;
	//procees login
	var TTL = 86400000;
		
	db.collection('user').find({ phoneNumber : myPhoneNumber, token : myAuthToken }).toArray(function (err, resultFind) {
		if(resultFind.toString != '' && resultFind.length > 0){
				var myAuthToken = resultFind[0].token;
				var myTokenTimestamp =  resultFind[0].tokenTimestamp;
				
				if(myTokenTimestamp + TTL >= Date.now()){
					//Old Login detected, need new one
					//token invalid, user may request a new one
					res.send({ login : "FAIL_TOKEN_OUTDATED"});
					return;
					
				} else{
					res.send({ login : "SUCCESS_TOKEN_VALIDATED"});
					return;
				}
		}
		else{		//login failed no user with this number or this token available 
			res.send({ error: "1" });
			return;
		}
	});
	
	//set Data e.g. user is online etc
	
	
	
});

module.exports=router;