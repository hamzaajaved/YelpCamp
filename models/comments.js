var mongoose = require("mongoose");

var CommentSchema = new mongoose.Schema({
  text: String,
  author: String
});

module.exports = mongoose.model("Comment", CommentSchema);
