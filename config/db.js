 const mongoose = require('mongoose')
 const dbConfig = require('./dbconfig')

 const connectDB = async()=>{
     try{
         const conn= await mongoose.connect(dbConfig.database,{
             useNewUrlParser:true,
             useUnifiedTopology:true,
             useFindAndModify:false
             
         });
         console.log('MongoDB Connected : ${conn.connection.host}')
        //  let gfs;
// conn.once('open', () => {
//     //initialize our stream
//     gfs = mongoose.mongo.GridFSBucket(conn.db,{bucketName:'uploads'});
    
// })
     }
     catch(err){
         console.log(err)
         process.exit(1)
     }
 }
 module.exports =connectDB