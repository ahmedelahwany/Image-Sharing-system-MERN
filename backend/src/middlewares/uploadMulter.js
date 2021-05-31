const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './imagesFolders');
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, 'Image' + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage

});

module.exports = upload.single('name');
