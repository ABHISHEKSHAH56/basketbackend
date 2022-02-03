const ErrorHandeller = require("../utlis/errorhandller");

module.exports=(err,req,res,next)=>
{
    err.statusCode=err.statusCode||500;
    err.message=err.message||"Internal Server Error"
    
    //mongodb error 
    if(err.name=="CastError")
    {
        const message=`resouces not found .Invalid :${err.path}`
        err=new ErrorHandeller(message,400)
    }
    //mongoose  duplicatre 
    if(err.code==11000)
    {
        const message=`Duplicate ${Object.keys(err.keyValue)} entered `;
        err=new ErrorHandeller(message,400);
    }
    //wrong JWT error
    if(err.name=="JsonWebTokenError")
    {
        const message=`Json Web Token is inavlid ,Try Again`;
        err=new ErrorHandeller(message,400);
    }
    //JWT expire
    if(err.name=="TokenExpiredError")
    {
        const message=`Json Web Token expired,Try Again`;
        err=new ErrorHandeller(message,400);
    } 

    
    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}