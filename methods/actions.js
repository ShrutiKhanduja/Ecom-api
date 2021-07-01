var User = require('../models/user')
var jwt =require('jwt-simple')
var config= require('../config/dbconfig')
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt')
var multer = require('multer');
// const express = require('express')
// const router = express.Router()
// router.use(express.static(__dirname+"./uploads"))
 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + '-' + Date.now())
    }
});
 
const upload = multer({ storage: storage });
var functions ={
    addNew: upload.single('image'),function(req,res){
        console.log(res.body)
        if((!req.body.name) || (!req.body.password) ){
           res.json({success : false, msg :'Enter all fields'})
        }
        else{


            var newUser =User({
                name:req.body.name,
                password: req.body .password,
                image: {
                    data: fs.readFileSync(path.join(__dirname+'uploads/' + req.file.filename)),
                    contentType: 'image/png'
                }
            });
            newUser.save(function(err,newUser){
                if(err){
                    res.json({success: false,msg:'Failed to save'})
                    console.log(err)
                }
                else{
                    res.json({success:true,msg:'Successfully saved'})
                }
            })
        }
    },
    authenticate: function(req,res){
        User.findOne({
            name : req.body.name
        }, function(err,user){
            if(err) throw err
            if(!user){
                res.status(403).send({success: false,msg:'Authentication failed , User not found'})
            }
            else{
                user.comparePassword(req.body.password,function(err,isMatch){
                    if(isMatch && !err){
                        var token = jwt.encode(user,config.secret)
                        res.json({success:true,token:token})
                    }
                    else{
                        return res.status(403).send({success:false,msg:'Authentication failed,wrong password'})
                    }
                })
            }
        }
        )
    },
    getinfo: function(req,res){
        if(req.headers.authorization && req.headers.authorization.split(' ')[0]== 'Bearer'){
            var token = req.headers.authorization.split(' ')[1]
            var decodedtoken = jwt.decode(token,config.secret)
            return res.json({success: true,msg:'Hello ' +decodedtoken.name})
        }
        else{
            return res.json({success:false, msg:'No headers'})
        }
    }
} 

module.exports = functions;