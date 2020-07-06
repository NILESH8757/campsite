var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all the middleware goes here

var middlewareObj = {};

middlewareObj.checkCampOwnership = function(req, res, next){
	// is user logged in ?
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, (err, foundCamp) =>{
		if(err || !foundCamp){
			req.flash("error", "Campground not found!");
			res.redirect("back");
		} else {
			// if yes, does user own cmapgournd data ?
			if(foundCamp.author.id.equals(req.user._id)) {
			  next();
			} else {
			  req.flash("error", "Permission denied.");
			   res.redirect("back");
			}
			 
		}
	  });
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	// is user logged in ?
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, (err, foundComment) =>{
		if(err || !foundComment){
			req.flash("error", "Comment not found");
			res.redirect("back");
		} else {
			// if yes, does user own comment ?
			if(foundComment.author.id.equals(req.user._id)) {
			  next();
			} else {
			   req.flash("error", "Permission denied.");
			   res.redirect("back");
			}
		}
	  });
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
	req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

  middlewareObj.isAdmin = function(req, res, next) {
    if(req.user.isAdmin) {
      next();
    } else {
      req.flash('error', 'This site is now read only thanks to spam and trolls.');
      res.redirect('back');
    }
  }
  
  middlewareObj.isSafe = function(req, res, next) {
    if(req.body.image.match(/^https:\/\/images\.unsplash\.com\/.*/)) {
      next();
    }else {
      req.flash('error', 'Only images from images.unsplash.com allowed.\nSee https://youtu.be/Bn3weNRQRDE for how to copy image urls from unsplash.');
      res.redirect('back');
    }
  }
module.exports = middlewareObj;