var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
//===============================
// COMMENTS ROUTES 
//===============================

// show form to add new comment
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, (req, res) =>{
	//find Campground by id
	Campground.findById(req.params.id, (err, Camp) =>{
		if(err){
			console.log(err);
		} else{
			res.render("comments/new", {campground : Camp});
		}
	}); 
});

// add new comment
router.post("/campgrounds/:id/comments", middleware.isLoggedIn,(req, res) =>{
      //lookup campground using id 
	Campground.findById(req.params.id, (err, Camp) =>{
	   if(err){
		   console.log(err);
		   res.redirect("/campgrounds");
	   }else {
		   Comment.create(req.body.comment, (err, comment) =>{
			  if(err){
				  req.flash("error", "Something went wrong!");
				  console.log(err);
			  } else {
				  comment.author.id = req.user._id;
				  comment.author.username = req.user.username;
				  comment.save();
				  Camp.comments.push(comment);
				  Camp.save();
				  req.flash("success", "Comment added");
				  res.redirect('/campgrounds/' + Camp._id);
			  }
		   });
	   }
	});
});

//COMMENTS EDIT ROUTE
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, (req, res) =>{
    Campground.findById(req.params.id, (err, foundCamp) =>{
		if(err || !foundCamp) {
			req.flash("error", "No campground found");
			return res.redirect("back");
		}
	});
	Comment.findById(req.params.comment_id, (err, foundComment) =>{
		if(err){
			res.redirect("back");
		} else{
		   res.render("comments/edit", {campground_id : req.params.id, comment : foundComment});
		}
	});
})

//COMMENT UPDATE
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res) =>{
	 Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) =>{
		 if(err){
			 res.redirect("back");
		 } else {
             res.redirect("/campgrounds/" + req.params.id);
		 }
	 })
});

//COMMENT DELETE ROUTE 
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res) =>{
	Comment.findByIdAndRemove(req.params.comment_id, (err) =>{
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})

module.exports = router;