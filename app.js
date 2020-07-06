var   express        = require("express"),
	  app            = express(),
	  bodyParser     = require("body-parser"),
	  passport       = require("passport"),
      LocalStrategy  = require("passport-local"),
	  methodOverride = require("method-override"),
	  mongoose       = require("mongoose"),
	  flash          = require("connect-flash"),
	  Campground     = require("./models/campground"),
	  Comment        = require("./models/comment"),
	  User           = require("./models/user");
      // seedDB       = require("./seeds")

//requiring routes
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");

// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

const databaseUri = process.env.MONGODB_URI || 'mongodb://localhost/campdb';
const PORT = process.env.PORT || 3000;

mongoose.connect(databaseUri, { useMongoClient: true })
      .then(() => console.log(`Database connected`))
      .catch(err => console.log(`Database connection error: ${err.message}`));

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash()); 
app.set("view engine", "ejs");

//PASSPORT CONFIGURATION 
app.use(require("express-session")({
	secret : "Daddy is no more!",
	resave : false,
	saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

app.use((req, res, next) =>{
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);


if(process.env.NODE_ENV === 'production'){
	app.use(express.static('build'));
}

// tell express to listen for requests (start server)
app.listen(PORT , process.env.IP, ()=>{
	console.log(" camp-server running");
});