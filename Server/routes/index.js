var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Chatservice' });
});

/* GET Userlist page. */
router.get('/groups', function(req, res) {
	res.render('groups', { title: 'Chatservice' });
});

module.exports = router;
