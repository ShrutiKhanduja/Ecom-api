var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt')
// var imageSchema = new mongoose.Schema({
    
    
    
//         data: Buffer,
//         contentType: String
   
// });
var userSchema = new Schema({
   
    name:{
        type : String,
        require : true
    },
    password : {
        type: String,
        require : true
    },
    image:{
        type:String,
        require:false
    }
    
})

userSchema.pre('save',function (next){
    var user = this;
    if(this.isModified('password')||this.new){
        bcrypt.genSalt(10,function(err,salt){
            if(err){
                return next(err)
            }
            bcrypt.hash(user.password,salt,function (err,hash){
                if(err){
                    return next(err)
                }
                user.password =hash;
                next()
            })
        })
    }
    else {
        return next()
    }
})
userSchema.methods.comparePassword = function (passw,cb){
    bcrypt.compare(passw,this.password,function(err,isMatch){
        if(err){
            return cb(err)
        }
        cb(null,isMatch)
    })
}

module.exports =mongoose.model('User',userSchema)