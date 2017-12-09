var mongoose = require("mongoose");
var bidSchema = new mongoose.Schema({
   username:String,
    value:{type:Number,default:0}
    
});

module.exports = mongoose.model("Bid",bidSchema);