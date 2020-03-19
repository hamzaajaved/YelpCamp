var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");
var middleware = require("../middleware");

//Comments New
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(
  req,
  res
) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("Comments/new", { campground: campground });
    }
  });
});
//Comments Create
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(
  req,
  res
) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      // console.log(req.params.id);

      var text = req.body.text;
      var author = req.body.author;

      var newComment = { text: text, author: author };
      // console.log(newComment);
      Comment.create(newComment, function(err, comment) {
        if (err) {
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          // console.log(comment);

          campground.comments.push(comment);
          campground.save();
          console.log(comment);
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

// EDIT COMMENT ROUTE
router.get(
  "/campgrounds/:id/comments/:comment_id/edit",
  middleware.checkCommentOwnerShip,
  function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        console.log(err);
      } else {
        res.render("Comments/edit", {
          campground_id: req.params.id,
          comment: foundComment
        });
      }
    });
  }
);
// UPDATE COMMENT ROUTE
router.put(
  "/campgrounds/:id/comments/:comment_id",
  middleware.checkCommentOwnerShip,
  function(req, res) {
    // console.log(req.body.text);
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(
      err,
      updatedcomment
    ) {
      if (err) {
        res.redirect("back");
      } else {
        res.redirect("/campgrounds/" + req.params.id);
      }
    });
    // res.send("Updated Comment");
  }
);

// DELETE COMMENT ROUTE
router.delete(
  "/campgrounds/:id/comments/:comment_id",
  middleware.checkCommentOwnerShip,
  function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(
      err,
      foundComment
    ) {
      if (err) {
        res.redirect("back");
      } else {
        res.redirect("/campgrounds/" + req.params.id);
      }
    });
  }
);

module.exports = router;
