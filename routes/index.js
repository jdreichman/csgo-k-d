const express = require('express'),
	router = express.Router(),
	SteamCommunity = require('steamcommunity'),
	community = new SteamCommunity(),
	path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CS:GO Deathmatch Point System' });
});

router.get('/account', ensureAuthenticated, function(req, res) {
	res.render('account', '../public', 'account.html');
});

router.get('/inventory', ensureAuthenticated, function(req, res) {
	res.render('inventory', '../public', 'inventory.html');
});

router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()) return next();
	res.redirect('/');
}

module.exports = router;
module.exports = router;
