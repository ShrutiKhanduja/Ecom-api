const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const connectDB = require('./config/db')
const passport = require('passport')
const bodyParser = require('body-parser') 
const routes = require('./routes/index.js')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const crypto = require('crypto')//to generate file name
var fs = require('fs');
var path = require('path');
const formData =require('express-form-data')
const formidable =require('express-formidable');
var upload=multer();
connectDB()
const app=express()
if(process.env.NODE_ENV == "development"){
    app.use(morgan("dev"))
}
// Set EJS as templating engine
app.set("view engine", "ejs");
 app.use(express.static('uploads'));
// app.use(upload.array());
app.use(cors())
// app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use(express.json());
// app.use(formidable());

app.use(routes)
app.use(passport.initialize())
require('./config/passport')(passport)
const PORT= process.env.PORT || '8080';
app.set('port',PORT)
app.listen(PORT,console.log('Server running in: ${process.env.NODE_ENV} mode on port ${PORT}'))