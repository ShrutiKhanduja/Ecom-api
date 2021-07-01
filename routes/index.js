const express = require('express')
const actions = require('../methods/actions.js')
const router = express.Router()
var path = require('path');
const GridFsStorage = require('multer-gridfs-storage')
var config= require('../config/dbconfig')
const crypto = require('crypto')//to generate file name
const { pathToFileURL } = require('url')
var User = require('../models/user')
var model=require('../models/image.js');
const DOCUMENT = require("../models/Document");
var AWS = require("aws-sdk");
var multer = require('multer');
const { db } = require('../models/user');
const dbconfig = require('../config/dbconfig');
var mongoose = require('mongoose')
var storage = multer.memoryStorage();
require("dotenv").config();
router.get('/',(req,res)=>{
    res.send('Hello World')
})
router.get('/dashboard',(req,res)=>{
    res.send('Dashboard')
})
// const storage = new GridFsStorage({
//     url: config.database,
//     file: (req, file) => {
//         return new Promise(
//             (resolve, reject) => {
//                 crypto.randomBytes(16,(err,buf)=>{
//                     if(err){
//                         return reject(err)
//                     }
//                     const filename =buf.toString('hex') + pathToFileURL.extname(file.originalname)
//                     const fileInfo ={
//                         filename:filename,
//                         bucketName:'uploads'
//                     }
//                     resolve(fileInfo)
//                 })
                      

//             }
//         )
//     }
// })
// const upload = multer({ storage })
// var multer = require('multer');
 
// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// });
 
// var upload = multer({ storage: storage });
//@desc Adding new user
// @route POST/adduser

// const express = require('express')
// const router = express.Router()
// router.use(express.static(__dirname+"./uploads"))
 
// var storage = multer.diskStorage({
//     destination:"./uploads/",
    
//     filename: (req, file, cb) => {
//         cb(null, file.originalname + '-' + Date.now())
//     }
// });
// router.use(express.static("./uploads/"));
// var storage = multer.diskStorage({
//    destination: function (req, file, cb) {
//     cb(null,'uploads');
//    },
//    filename: function (req, file, cb) {
//     cb(null,new Date().getTime()+'-'+file.originalname)
//    }
//  })
const upload = multer({ storage: storage })
 
// router.post('/photo',upload.single('image'),function(req,res){
//     console.log(req.body.files);
//     console.log(req.file);
//   if(req.file==undefined){
//       res.json({msg:"error"})
//   }
//   else{
//       res.json({succes:"uploaded",path:req.file.filename})
//   }
// })
// router.post('/photo', upload.single('image'), async(req, res, next) => {    
//     const file = req.file    
//     console.log(file);
//     if (!file) {      
//     const error = new Error('Please upload a file')      
//     return next("hey error")    
//     }                  
//     const imagepost= new model({        
//     image: file.path      
//     })
          
//     const savedimage= await imagepost.save()      
//     res.json(savedimage)      
//     })   
    // app.get('/image',async(req, res)=>{   
    // const image = await model.find()   
    // res.json(image)     
    // })
    router.post("/photo", upload.single("image"), function(req, res) {
        const file = req.file;
        console.log(file);
        const s3FileURL = process.env.AWS_Uploaded_File_URL_LINK;
      
        let s3bucket = new AWS.S3({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID.trim(),
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY.trim(),
          region: process.env.AWS_REGION.trim()
        });
      
        console.log(process.env.AWS_ACCESS_KEY_ID);
        console.log(process.env.AWS_SECRET_ACCESS_KEY);
      
        //Where you want to store your file
      
        var params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: file.originalname,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: "public-read"
        };
      
        s3bucket.upload(params, function(err, data) {
          if (err) {
            res.status(500).json({ error: true, Message: err });
          } else {
            res.send({ data });
            var newFileUploaded = {
              description: req.body.description,
              fileLink: s3FileURL + file.originalname,
              s3_key: params.Key
            };
            var document = new DOCUMENT(newFileUploaded);
            document.save(function(error, newFile) {
              if (error) {
                throw error;
              }
            });
          }
        });
      });
      router.post('/update',function(req,res,next){
        console.log(req.url);
        console.log(req.body.url); 
        var collect =db.collection("users");
        console.log(collect);
        // console.log(db.users);
        collect.update(
          {_id:mongoose.Types.ObjectId(req.body.id)},{$set :{image:req.body.url}},
          function(err, result) {
            if (err) { console.log(err); res.send(err); return;}
            if (result) {
              res.send("/user/show");
            } else {
              res.send("/user/notshow");
          }
        }
        )
          
      })
      
router.post('/adduser',  function(req,res,next){
    
    
    console.log(req.body.name)
    console.log(req.body.password)
    if((!req.body.name) || (!req.body.password) ){
       res.json({success : false, msg :'Enter all fields'})
    }
    else{


        var newUser =User({
            
            name:req.body.name,
            password: req.body.password,
            image:" "
           
            // image: {
            //     data: fs.readFileSync(path.join(__dirname+'uploads/' + req.file.filename)),
            //     contentType: 'image/png'
            // }
        });
        newUser.save(function(err,newUser){
            if(err){
                res.json({success: false,msg:'Failed to save'})
                console.log(err)
            }
            else{
                res.json({success:true,msg:'Successfully saved',uid:newUser._id})
            }
        })
    }
}),
router.post('/authenticate',actions.authenticate),
router.get('/getinfo',actions.getinfo),

module.exports = router ; 