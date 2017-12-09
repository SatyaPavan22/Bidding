var mongoose = require("mongoose"),
    Item = require("./models/item"),
    Bid = require("./models/bid"),
    User     = require("./models/user");
   
   var itemData = [
              { value:50,
                images:["homePage4.png"],
                sold:false,
                itemname:"laptop"}
                
                ];
      
      function seedDb(){
          Item.remove({},function(err){
              if(err){
                  console.log(err);
              }else{
                  console.log("Removed Items");
                  itemData.forEach(function(seed){
                 Item.create(seed,function(err,itemcreated){
                  if(err){
                      console.log(err);
                  }else{
                      itemcreated.save();
                  }
              }); 
                  });
              }
          });
        User.remove({},function(err){
            if(err){
                console.log(err);
            }else{
                console.log("Removed users");
            }
        });
        Bid.remove({},function(err) {
            if(err){
                console.log(err);
            }else
            {
                console.log("removed bidders");
            }
        })
      }
      
      module.exports = seedDb;