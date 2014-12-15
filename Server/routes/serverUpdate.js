var express = require('express');
var router = express.Router();

router.post('/execute', function(req, res) {
console.log("Start Script! #Version2");
var sys = require('sys');
var exec = require('child_process').exec;
 
function puts(error, stdout, stderr) { sys.puts(stdout) }
exec("/home/serverDev/update.sh", puts);
res.send("");
});

module.exports = router;