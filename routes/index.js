var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


//root route
router.get("/", (req, res) => {
	res.render("landing");
});



//==============
// AUTH ROUTES
//==============

// show register form 
router.get("/register", (req, res) =>{
	res.render("register");
});

//handles sign up logic
router.post("/register", (req, res) =>{
			// var newUser = new User({username: req.body.username});
			// User.register(newUser, req.body.password, (err, user) => {
			// if(err){
			// // console.log(err);
			// // req.flash("error", err.message);
			// return res.render("register");
			// }
			// passport.authenticate("local")(req, res, () => {
			// // req.flash("sucess", "Welcome to Campsite " + user.username);
			// res.redirect("/campgrounds"); 
			// });
			// });
	var newUser = new User({username: req.body.username});
    if(req.body.adminCode === process.env.ADMIN_CODE) {
      newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/campgrounds"); 
        });
    });
});


// show login form
router.get("/login", (req, res) =>{
   res.render("login"); 
});
// handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req, res) =>{
});

// logout route
router.get("/logout", (req, res) =>{
   req.logout();
   req.flash("error", "Logged you out!");
   res.redirect("/campgrounds");
});


module.exports = router;   
