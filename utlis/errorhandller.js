class ErrorHandeller extends Error{
    constructor(message,statusCode)
    {   //parent construtor call
         super(message)
         this.statusCode=statusCode
         Error.captureStackTrace(this,this.constructor)
    }
}

module.exports=ErrorHandeller;