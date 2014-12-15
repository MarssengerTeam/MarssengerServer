var express = require('express');
var router = express.Router();

router.post('/execute', function(req, res) {
console.log("Start Script! #Version2");
var exec = require('child_process').exec;
 
function puts(error, stdout, stderr) {
console.log(stdout)
console.log(stderr);
}
exec("/home/serverDev/update.sh", puts);
res.send("");
});

module.exports = router;