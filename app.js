var express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  methodOverride = require("method-override"),
  LocalStrategy = require("passport-local"),
  // passportLocalMongoose = require("passport-local-mongoose"),
  // Campground = require("./models/campgrounds"),
  // Comment = require("./models/comments"),
  User = require("./models/user");
// seedDB = require("./seeds");

//requiring routes
var CommentRoute = require("./routes/comments"),
  CampgroundRoute = require("./routes/campground"),
  indexRoute = require("./routes/index");

// seedDB();
mongoose.connect("mongodb://localhost/yelp_camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
// app.use(express.static(__dirname + "/public"));

// ============================
// PASSPORT CONFIGURATION
// ============================
app.use(
  require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser(User));

// MIDDLEWARE
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(CommentRoute);
app.use(CampgroundRoute);
app.use(indexRoute);

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("The YelpCamp Server Has Started!");
});
