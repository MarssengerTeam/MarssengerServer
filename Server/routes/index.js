var express = require('express');
var router = express.Router();

/* GET HOME page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Chatservice' });
});

/* GET GROUP page. */
router.get('/groups', function(req, res) {
	res.render('groups', { title: 'Chatservice : Groups' });
});

/* GET USER page. */
router.get('/user', function(req, res) {
	res.render('user', { title: 'Chatservice : User' });
});

/* GET MESSAGE page. */
router.get('/message', function(req, res) {
	res.render('message', { title: 'Chatservice : Message' });
});

module.exports = router;
