const mongoose=require("mongoose")

const connectdatabse=()=>{
    mongoose.connect(
        process.env.DBurl,
        {
          //Connecting To Mongo DB Database Before Starting Node Server
          useNewUrlParser: true,
          useUnifiedTopology: true,
          
        }).then((data)=>{
          console.log(`Mongodb connected with server :${data.connection.host}`)
        });
        //catch me nhi dalenge kuki promise resolve ho jaaygi ....
        //to hum server band nhi kar paayga this eill create mess
}

module.exports=connectdatabse