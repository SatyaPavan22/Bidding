var express = require("express");
var Passport = require("passport");
var User = require("../models/user"),
     Item = require("../models/item"),
     Bid = require("../models/bid"),
   LocalStrategy = require("passport-local"),
    router = express.Router();
    
    Passport.use(new LocalStrategy(User.authenticate()));
    Passport.serializeUser(User.serializeUser());
    Passport.deserializeUser(User.deserializeUser());
    
    
    
    router.get("/",function(req,res){
        if(req.user && req.user._id){
            var startTime = new Date("December 1 2017 15:30").getTime();
        var currentUserId = req.user._id;
        /*Item.find(function(err,allItems){
           if(err){
               console.log(err);
           } else{
               res.render("home",{startTime:startTime,allItems:allItems});
           }
        });*/
        res.render("home");
            
        }
        else{
          res.redirect("login");
          }
    });
    
    router.get("/allItems",function(req, res) {
        if(req.xhr){
       Item.find(function(err,allItems){
           if(err){
               console.log(err);
           } else{
               res.status(200).json({allItems:allItems}); 
           }
        }); 
        }
    });
    
    router.get("/items",function(req, res) {
        Item.find(function(err, allItems) {
            if(err){
                console.log(err);
            }else{
                res.render("items",{items:allItems});
            }     
        });
    });
    
    router.get("/users",function(req, res) {
        if(req.user && req.user._id){
       User.find(function(err,allUsers){
           if(err){
               console.log(err);
        }else if(req.xhr){
               res.status(200).json({allUsers:allUsers,currentUser:req.user});
           }
           else{
               res.render("users",{allUsers:allUsers});
           }
       }) ;
        }else{
            res.redirect("login");
        }
    });
    
    router.get("/register",function(req,res){
      res.render("register");
    });
    
    router.post("/register",function(req,res){
       var newUser = new User({username:req.body.username});
       newUser.nickname = req.body.nickname;
       newUser.save();
       User.register(newUser,req.body.password,function(err,user){
         if(err){
             console.log("Error");
           res.redirect("back");
         }else{
           Passport.authenticate("local")(req,res,function(){
            var newBid = new Bid({username:newUser.username,value:0});
            newBid.save();
             res.redirect("/");
           });
         }
       });
    });
    
    router.get("/login",function(req, res) {
        res.render("login");
    });
    
    router.post("/login",Passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/login"
    }),function(req,res){
    
  });
  
  router.get("/date",function(req, res) {
   var countDownDate = new Date("Jan 15, 2018 20:43:42:00").getTime();
    var now = new Date().getTime()+(5.5*60*60*1000); 
    console.log(now);
    var diff= (countDownDate-now)/1000;
    console.log(diff);
    var remainingTime = Math.floor(diff);
    res.status(200).json({remainingTime:remainingTime});
  });
  
  router.get("/bids",function(req, res) {
      if(req.xhr){
      Bid.find({}).sort({ value: -1 }).exec((function(err, allBids) {
          if(err){
              console.log(err);
          }else{
              //console.log("before sending "+allBids);
             res.status(200).json({allBids:allBids});  
          }
      }));
      }
  });
    
     router.post("/bidspavan",function(req, res) {
         if(req.xhr){
         console.log("post bid called "+req.body.username);
      Bid.findOne({username:req.body.username},function(err, foundBid) {
          if(err){
              console.log(err);
          }else{
             foundBid.value = req.body.value;
             foundBid.save();
             res.status(200).send("success");
          }
      });
         }
  });
   
   router.post("/updatebid",function(req, res) {
       if(req.xhr){
           console.log("is jquery request "+req.body.bidData.allBids[0]);
      User.findOne({username:req.body.bidData.allBids[0].username},function(err,foundUser){
          if(err){
              console.log(err);
          }else if(req.user._id.equals(foundUser._id)){
              console.log("requested user"+req.user._id.equals(foundUser._id));
              console.log("found user"+foundUser.username+" "+req.user.username);
              foundUser.amounthas = foundUser.amounthas - req.body.bidData.allBids[0].value;
              Item.findOne({itemname:req.body.boughtItem},function(err, foundItem) {
                 
                  if(err){
                      console.log(err);
                  }else{
                  foundItem.owner.push(foundUser);
                  foundItem.sold = true;
                  foundItem.save();
                  foundUser.itemsaquired.push(foundItem);
                  foundUser.save();
                  console.log(foundUser);
                  }
              });
      
        Bid.update({},{value: 0}, {multi: true},function(err){
           if(err){
               console.log(err);
           } else{
               console.log("updated bidders");
           }
        });
        res.status(200).send("success");
       }
      });
       }
   });
    
  module.exports = router;