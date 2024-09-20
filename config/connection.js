var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
var dbname = 'Recipo';

let db;

function connectToDatabase(){
    return MongoClient.connect(url,{useNewUrlParser: true, useUnifiedTopology: true})
    .then((client)=>{
        console.log('Database connected successfully');
        db = client.db(dbname);
    })
    .catch((err)=>{
        console.error('Failed to connect to database',err);
    });
}

function getdb(){
    if(!db){
        console.warn('Database not Initialized');
    }else{
        return db;
    }
}

module.exports = {connectToDatabase,getdb};