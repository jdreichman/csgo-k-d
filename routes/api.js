const express = require('express'),
	router = express.Router(),
	SteamCommunity = require('steamcommunity'),
	User = require('../models/user'),
	community = new SteamCommunity();

router.route('/kill').get(ensureAuthenticated,function(req,res){
	User.findOne({steam_id: req.user.steam_id}, function(err, user) {
		if(err) throw err;
		if(!user) {
			//User does not exist, define new user
			var newUser = User({
				steam_id: req.user.steam_id,
				username: req.user.username,
				photo_url: null,
				kills: 1,
				deaths: 0,
				points: 1
			});
			//Save new user to DB
			newUser.save(function(err) {
				if(err) throw err;
				console.log('New user ' + req.user.username + '[' + req.user.steam_id + '] created');
			});
		} else {
			User.update(
				{
					steam_id:user.steam_id
				}, 
				{
					kills : user.kills + 1,
					points: parseInt(user.points) + parseInt(process.env.CS_POINTS_ADD)
				},
				function(err){
				if(err) throw err;
			})
		}
	});
	res.send();
});

router.route('/death').get(ensureAuthenticated,function(req,res){
	User.findOne({steam_id: req.user.steam_id}, function(err, user) {
		if(err) throw err;
		if(!user) {

		} else {
			User.update(
				{
					steam_id:user.steam_id
				}, 
				{
					deaths : user.deaths + 1,
					points: parseInt(user.points) - parseInt(process.env.CS_POINTS_REMOVE)
				},
				function(err){
				if(err) throw err;
			})
		}
	});
	res.send();
});

router.route('/auth/loginstatus').get(function(req, res) {
	console.log('[API] Checking a user\'s auth status');
	if(req.isAuthenticated()) return res.json(req.user);
	return res.send(false);
});

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()) return next();
	res.send(false);
}

module.exports = router;