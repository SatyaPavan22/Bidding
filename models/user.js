var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var userSchema = new mongoose.Schema({
    username:String,
    password:String,
    nickname:String,
    amounthas:{type:Number,default:1000},
    bidamount:Number,
    itemsaquired:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Item"
    }],
    
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",userSchema);