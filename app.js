var express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  Campground = require("./models/campgrounds"),
  Comment = require("./models/comments"),
  seedDB = require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
// app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
  res.render("Campgrounds/landing");
});

app.get("/campgrounds", function(req, res) {
  Campground.find({}, function(err, campgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("Campgrounds/index", { campgrounds: campgrounds });
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

app.get("/campgrounds/:id/comments/new", function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("Comments/new", { campground: campground });
    }
  });
});

app.post("/campgrounds/:id/comments", function(req, res) {
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

app.listen("5000", function() {
  console.log("server is started");
});
