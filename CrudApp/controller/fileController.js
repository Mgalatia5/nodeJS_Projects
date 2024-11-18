//file upload
import multer from 'multer';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/assets/img')
  },
  filename: function (req, file, cb) {
    const _fileName = Date.now() + file.originalname
    req._fileName = _fileName;
    cb(null, file.fieldname + '-' + _fileName)
  }
})
const upload = multer({ storage })
//end file upload

export default upload;

