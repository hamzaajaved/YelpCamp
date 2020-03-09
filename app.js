var express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  Campground = require("./models/campgrounds"),
  Comment = require("./models/comments"),
  User = require("./models/user"),
  seedDB = require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
// app.use(express.static(__dirname + "/public"));

// ============================
// PASSPORT CONFIGURATION
// ============================
app.use(
  require("express-session")({
    secret: "Once again Rusty wins cutest dogs!",
    resave: false,
    saveUninitialized: false
  })
);

// MIDDLEWARE
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser(User));

// ===================
// ROUTES
// ===================

app.get("/", function(req, res) {
  res.render("Campgrounds/landing");
});

app.get("/campgrounds", function(req, res) {
  Campground.find({}, function(err, campgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("Campgrounds/index", {
        campgrounds: campgrounds,
        currentUser: req.user
      });
    }
  });
});

app.get("/campgrounds/new", function(req, res) {
  res.render("Campgrounds/new.ejs");
});

// Display a Form to make a new Campground
app.post("/campgrounds", function(req, res) {
  //   res.send("YOU HIT THE POST ROUTE");
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = { name: name, image: image, description: desc };
  // campgrounds.push(newCampground);
  Campground.create(newCampground, function(err, campground) {
    if (err) {
      console.log("SOMETHING WENT WRONG");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// Show info about one campground page
app.get("/campgrounds/:id", function(req, res) {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundCampground) {
      if (err) {
        console.log(error);
      } else {
        res.render("Campgrounds/show", { Campground: foundCampground });
      }
    });
});

// ===================
// Comments Routes
// ===================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("Comments/new", { campground: campground });
    }
  });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      // console.log(req.params.id);

      var text = req.body.text;
      var author = req.body.author;

      var newComment = { text: text, author: author };
      console.log(newComment);
      Comment.create(newComment, function(err, comment) {
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

// ============================
// AUTHENTICATION ROUTES
// ============================

// SHOW REGISTER FORM
app.get("/register", function(req, res) {
  res.render("register");
});

// HANDLING REGISTER LOGIC
app.post("/register", function(req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render("/register");
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/campgrounds");
      });
    }
  });
});

// SHOW LOGIN FORM
app.get("/login", function(req, res) {
  res.render("login");
});

// HANDLING LOGIN LOGIC
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }),
  function(req, res) {}
);

// LOGOUT ROUTE
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("server is started");
});
