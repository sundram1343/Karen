const multer=require('multer');
const fs=require('fs');
const path=require('path');
const Storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        if (!file) {
            return cb(new Error('No file provided'), false);
        }
        const userid=req.user.id || req.user._id.toString();
        const uploadPath = path.join(__dirname, '..', 'uploads', userid);
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload=multer({storage:Storage});
module.exports=upload;