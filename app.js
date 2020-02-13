var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");

var campgrounds = [
  {
    name: "Salmon Creek",
    image: "https://farm9.staticflickr.com/8225/8524305204_43934a319d.jpg"
  },
  {
    name: "Granite Hill",
    image:
      "https://www.talk-business.co.uk/wp-content/uploads/2020/01/shutterstock_587557163.jpg"
  },
  {
    name: "Sunset Beach Rest",
    image:
      "https://d2ciprw05cjhos.cloudfront.net/files/v3/styles/gs_standard/public/images/18/06/gettyimages-649155058.jpg?itok=DG3f7cE4"
  }
];

app.get("/", function(req, res) {
  res.render("landing");
});

app.get("/campgrounds", function(req, res) {
  res.render("campgrounds", { campgrounds: campgrounds });
});

app.post("/campgrounds", function(req, res) {
  //   res.send("YOU HIT THE POST ROUTE");
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = { name: name, image: image };
  campgrounds.push(newCampground);

  res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
  res.render("new.ejs");
});

app.listen("5000", function() {
  console.log("server is started");
});
