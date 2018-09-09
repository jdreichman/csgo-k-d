const createError = require('http-errors'),
	config = require('./config');
	express = require('express'),
	path = require('path'),
	cookieParser = require('cookie-parser'),
	logger = require('morgan');
	mongoose = require('mongoose'),
	session = require('express-session'),
	passport=require('passport'),
	SteamStrategy = require('passport-steam').Strategy,
	indexRoutes = require('./routes/index'),
	authRoutes = require('./routes/auth'),
	apiRoutes = require('./routes/api'),
	User = require('./models/user')
	;

mongoose.connect(config.connectionString);
//Determine data to be stored in session
passport.serializeUser(function(user, done) {
	//save JSON data to session
	done(null, user._json);
});

//Match session data with DB data and parse
passport.deserializeUser(function(obj, done) {
	//Search DB for user with session's steam ID
	User.findOne({steam_id: obj.steamid},
		(err, user) => {
			//Fetched object is attached to request object (req.user)
			done(null, user);
		});
});

//Specify Passport authentication strategy (Steam)
passport.use(new SteamStrategy({
	returnURL: 'http://'+process.env.CS_BASE_URI+':80/auth/steam/return',
	realm: 'http://'+process.env.CS_BASE_URI + ":80",
	apiKey: process.env.CS_STEAM_API_KEY
}, function(identifier, profile, done) {
	//Check if user exists in DB
	User.findOne({steam_id: profile.id}, function(err, user) {
		if(err) throw err;
		if(!user) {
			//User does not exist, define new user
			var newUser = User({
				steam_id: profile.id,
				username: profile.displayName,
				photo_url: profile.photos[2].value,
				kills: 0,
				deaths: 0,
				points: 0
			});
			//Save new user to DB
			newUser.save(function(err) {
				if(err) throw err;
				console.log('New user ' + profile.displayName + '[' + profile.id + '] created');
			});
		}
	});
	profile.identifier = identifier;
	return done(null, profile);
}));

const app = express();

//Initialise session
app.use(session({
	secret: 's3cr3tStr1nG',
	saveUninitialized: false,
	resave: false
}));

//Authentication middleware
app.use(passport.initialize());
app.use(passport.session());

//Point to static asset directory
app.use(express.static('public'));

//Define routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/', indexRoutes);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
