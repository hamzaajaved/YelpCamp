var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/campgrounds", function (req, res) {
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("Campgrounds/index", {
        campgrounds: allCampgrounds,
        currentUser: req.user,
      });
    }
  });
});

//NEW - show form to create new campground
router.get("/campgrounds/new", middleware.isLoggedIn, function (req, res) {
  res.render("Campgrounds/new.ejs");
});
//
//CREATE - add new campground to DB
router.post("/campgrounds", middleware.isLoggedIn, function (req, res) {
  //   res.send("YOU HIT THE POST ROUTE");
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = { id: req.user._id, username: req.user.username };

  var newCampground = {
    name: name,
    image: image,
    description: desc,
    author: author,
  };
  // campgrounds.push(newCampground);
  Campground.create(newCampground, function (err, campground) {
    if (err) {
      console.log("SOMETHING WENT WRONG");
    } else {
      // console.log(campground);
      res.redirect("/campgrounds");
    }
  });
});

// SHOW - shows more info about one campground
router.get("/campgrounds/:id", function (req, res) {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function (err, foundCampground) {
      if (err) {
        console.log(error);
      } else {
        res.render("Campgrounds/show", { Campground: foundCampground });
      }
    });
});

// EDIT CAMPGROUND ROUTE
router.get(
  "/campgrounds/:id/edit",
  middleware.checkCampgroundOwnerShip,
  function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampgrond) {
      if (err) {
        console.log(err);
      } else {
        res.render("Campgrounds/edit", { campground: foundCampgrond });
      }
    });
    // res.send("Hello World");
  }
);

// UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnerShip, function (
  req,
  res
) {
  // console.log(req.body.campground);
  var newCampground = {
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
  };

  Campground.findByIdAndUpdate(req.params.id, newCampground, function (
    err,
    updatedCampgrond
  ) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });

  // res.send("Hello World");
});

// DESTROY CAMPGROUND ROUTE
router.delete(
  "/campgrounds/:id",
  middleware.checkCampgroundOwnerShip,
  function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err, foundCampgrond) {
      if (err) {
        res.redirect("/campgrounds");
      } else {
        res.redirect("/campgrounds");
      }
    });
  }
);

module.exports = router;
