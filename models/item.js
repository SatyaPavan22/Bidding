var mongoose = require("mongoose");
var itemSchema = new mongoose.Schema({
    value:Number,
    itemname:String,
    images:[{
        type:String
    }],
    owner:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    sold:Boolean
    
});

module.exports = mongoose.model("Item",itemSchema);