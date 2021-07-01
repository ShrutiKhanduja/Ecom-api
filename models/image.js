var mongoose = require('mongoose')
var Schema = mongoose.Schema
const imageSchema= mongoose.Schema(
    {
        image:{
            type: String,
            required: true
        }
    }
);


module.exports=mongoose.model("Image",imageSchema)