const app = require("./app");
const dotenv=require("dotenv");
const cloudinary=require("cloudinary")
const connectdatabse = require("./config/database");
dotenv.config({path:"backend/config/config.env"});




//connected database 
connectdatabse()

//handling uncaught promise its basically useing of event functionality (registering the event)
//somewhere in backend it will be called by methos emit asyncrly 
process.on("uncaughtException",err=>{
    console.log(`Error:${err.message}`)
    console.log(`Shuting the server due to uncaught exception`);
    server.close(()=>{
        process.exit(1);
    })
    
})
const server=app.listen(process.env.PORT,()=>{
    console.log(`server running at the ${process.env.PORT}`)
})

//unhandle promise rejection 
//we need to close the server asap
process.on("unhandledRejection",err=>{
    console.log(`Error :${err.message}`)
    console.log(`Shuting the server due to unhandle Promise rejection`);
    server.close(()=>{
        process.exit(1);
    })
})