var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");

router.get("/campgrounds", function(req, res) {
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

router.get("/campgrounds/new", isLoggedIn, function(req, res) {
  res.render("Campgrounds/new.ejs");
});

// Display a Form to make a new Campground
router.post("/campgrounds", isLoggedIn, function(req, res) {
  //   res.send("YOU HIT THE POST ROUTE");
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = { id: req.user._id, username: req.user.username };

  var newCampground = {
    name: name,
    image: image,
    description: desc,
    author: author
  };
  // campgrounds.push(newCampground);
  Campground.create(newCampground, function(err, campground) {
    if (err) {
      console.log("SOMETHING WENT WRONG");
    } else {
      console.log(campground);
      res.redirect("/campgrounds");
    }
  });
});

// Show info about one campground page
router.get("/campgrounds/:id", isLoggedIn, function(req, res) {
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

// MIDDLEWARE
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
