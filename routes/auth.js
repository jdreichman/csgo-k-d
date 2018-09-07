const express = require('express'),
	router = express.Router(),
	passport = require('passport');

router.get('/steam', 
	passport.authenticate('steam'),
	function(req, res, next) {
	res.render('steam', { title: 'CS:GO Deathmatch Point System' });
  });
router.get('/steam/return',
	function(req, res, next){
		req.url = req.originalUrl;
		next();
	},
	passport.authenticate('steam', {failureRedirect: '/error'}),
	function(req, res)
	{
		res.redirect('/');
	});

module.exports = router;