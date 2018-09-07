const express = require('express'),
	router = express.Router(),
	SteamCommunity = require('steamcommunity'),
	community = new SteamCommunity(),
	path = require('path'),
	passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CS:GO Deathmatch Point System' });
});

router.get('/profile', function(req, res, next) {
	console.log('[API] Checking a user\'s auth status');
	if(req.isAuthenticated()) res.render('profile', { username: req.user.username, points : req.user.points });
	return res.send(false);
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
