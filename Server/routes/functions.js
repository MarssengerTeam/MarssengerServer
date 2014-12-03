var express = require('express');
var router = express.Router();
var gcm = require('node-gcm');

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

module.exports = router;