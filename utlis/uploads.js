const path=require('path')
const multer=require('multer')
const ErrorHandeller = require('./errorhandller')

var storate=multer.diskStorage({
    destination:function(req,res,cb){
        cb(null,'uploads/')
    },
    filename:function(req,file,cb)
    {
        let ext=path.extname(file.originalname)
        let name=path.basename(file.originalname,ext)
        const moonLanding =  Date.now();
        console.log(name)
        cb(null,name+'_'+moonLanding+ext)
    }
})

var uploads=multer({
    storage:multer.diskStorage({}),
    fileFilter:function(req,file,callback)
    {   let ext=path.extname(file.originalname);
        if(ext!==".jpg"&& ext==".png" && ext!==".png")        {
            callback(new ErrorHandeller("File is not allowd"))
            return ;
        }
        callback(null,true)
        
    }
    
});

module.exports=uploads