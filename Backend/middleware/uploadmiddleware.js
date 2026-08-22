const multer=require('multer');
const fs=require('fs');
const path=require('path');
const Storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        if (!file) {
            return cb(new Error('No file provided'), false);
        }
        const user=req.user.id;
        const uploadPath = path.join(__dirname, 'uploads', user._id.toString());
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload=multer({storage:Storage});
module.exports=upload;