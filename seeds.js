var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comments");

var data = [
  {
    name: "Sunset Beach Rest",
    image:
      "https://d2ciprw05cjhos.cloudfront.net/files/v3/styles/gs_standard/public/images/18/06/gettyimages-649155058.jpg?itok=DG3f7cE4",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit necessitatibus impedit commodi maiores omnis culpa nisi cumque repellat aspernatur quaerat exercitationem expedita, voluptatibus pariatur error odio, ipsam ea porro hic provident amet ex! Voluptatibus similique nisi ipsum? Earum, inventore."
  },
  {
    name: "Granite Hill",
    image:
      "https://www.talk-business.co.uk/wp-content/uploads/2020/01/shutterstock_587557163.jpg",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit necessitatibus impedit commodi maiores omnis culpa nisi cumque repellat aspernatur quaerat exercitationem expedita, voluptatibus pariatur error odio, ipsam ea porro hic provident amet ex! Voluptatibus similique nisi ipsum? Earum, inventore."
  },
  {
    name: "Sunset Beach Rest",
    image:
      "https://d2ciprw05cjhos.cloudfront.net/files/v3/styles/gs_standard/public/images/18/06/gettyimages-649155058.jpg?itok=DG3f7cE4",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit necessitatibus impedit commodi maiores omnis culpa nisi cumque repellat aspernatur quaerat exercitationem expedita, voluptatibus pariatur error odio, ipsam ea porro hic provident amet ex! Voluptatibus similique nisi ipsum? Earum, inventore."
  }
];

function seedDB() {
  Campground.remove({}, function(err) {
    if (err) {
      console.log(err);
    }

    console.log("Removed campgrounds.");

    data.forEach(function(seed) {
      Campground.create(seed, function(err, campground) {
        if (err) {
          console.log("SOMETHING WENT WRONG");
        } else {
          console.log("Created New Post");
          Comment.create(
            {
              text: "This place is good but I, wish there was Internet",
              author: "Muhammad Hamza"
            },
            function(err, comment) {
              if (err) {
                console.log(err);
              } else {
                campground.comments.push(comment);
                campground.save();
                console.log("Created New Comment");
              }
            }
          );
        }
      });
    });
  });
}

module.exports = seedDB;
