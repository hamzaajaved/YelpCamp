var express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  flash = require("connect-flash"),
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
mongoose.connect(
  "mongodb+srv://admin:admin@hamzajaved.kfyl4.mongodb.net/yelpcamp?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// const MongoClient = require("mongodb").MongoClient;
// const uri =
//   "mongodb+srv://admin:admin@yelpcamp-kfyl4.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// client.connect((err) => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(flash());

// ============================
// PASSPORT CONFIGURATION
// ============================
app.use(
  require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser(User));

// MIDDLEWARE
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(CommentRoute);
app.use(CampgroundRoute);
app.use(indexRoute);

var port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log("The YelpCamp Server Has Started!");
});
