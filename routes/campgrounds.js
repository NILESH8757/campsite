var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX - show all campgrounds
router.get("/campgrounds", (req, res) =>{
	// Get all campgrounds from db 
	Campground.find({}, (err, camps) => {
		if(err){
			console.log(err);
		}else{
		   res.render("campgrounds/index", {campgrounds : camps});
		}
	});
});

// CREATE - crating and saving a campground into DB
router.post("/campgrounds", middleware.isLoggedIn, (req, res) =>{
	var name = req.body.name;
	var imageurl = req.body.image;
	var desc = req.body.description;
	var price = req.body.price;
	var author = {
		id : req.user._id,
		username : req.user.username
	}
	var newCamp = {name : name, price : price, image : imageurl, description: desc, author : author};
	//create a new campground and save to DB 
	Campground.create(newCamp, (err, camp) =>{
		if(err){
		   consolelog(err);
		}else{
		  //redirect back to campgrounds page
		   res.redirect("/campgrounds");
		}
    });
});

// NEW - form to add a campground
router.get("/campgrounds/new", middleware.isLoggedIn, (req, res) =>{
	res.render("campgrounds/new")
}); 


//SHOW - show more info about one campground
router.get("/campgrounds/:id", (req, res) =>{
	//find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec((err, foundCamp) =>{
		if(err || !foundCamp){
			// console.log(err);
			req.flash("error", "Campground not found");
			res.redirect("back");
		} else{
			console.log(foundCamp);
			// render show template with that campground
			res.render("campgrounds/show", {campground : foundCamp});
		}
	});
}); 

//EDIT - edit campground
router.get("/campgrounds/:id/edit", middleware.checkCampOwnership, (req, res) =>{
	Campground.findById(req.params.id, (err, foundCamp) =>{
		   res.render("campgrounds/edit", {campground : foundCamp});
  });
});

//UPDATE - update campground 
router.put("/campgrounds/:id", middleware.checkCampOwnership, (req, res) =>{
	//find and update the correct campground redirect somewhere
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCamp) =>{
		if(err){
			res.redirect("/campgrounds");
		} else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	
})

// DESTROY - delete campground

router.delete("/campgrounds/:id", middleware.checkCampOwnership, (req, res) =>{
	Campground.findByIdAndRemove(req.params.id, (err) =>{
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;
