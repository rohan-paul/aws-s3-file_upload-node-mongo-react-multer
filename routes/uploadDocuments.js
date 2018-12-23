const multer = require("multer");
const path = require("path");
const mailSender = require("./mailSender");
const shortid = require("shortid");

// https://www.npmjs.com/package/multer#api
// Each file in multer will contain information for fieldname, filename
// 'destination' and 'filename' - both functions determine where the file should be stored and the name of the file at the destination
const storageEngine = multer.diskStorage({
  destination: "./uploads",
  filename: function(req, file, fn) {
    fn(
      null,
      new Date().getTime().toString() +
        "-" +
        file.fieldname +
        path.extname(file.originalname)
    );
  }
});

var validateFile = function(file, cb) {
  allowedFileTypes = /jpeg|jpg|png|gif|pdf/;
  const extension = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedFileTypes.test(file.mimetype);
  if (extension && mimeType) {
    return cb(null, true);
  } else {
    cb("Invalid file type. Only PDF, JPEG, PNG and GIF files are allowed.");
  }
};
// filename	is the name of the file within the destination DiskStorage
const uploadDocuments = multer({
  storage: storageEngine,
  limits: { fileSize: 200000 },
  fileFilter: function(req, file, callback) {
    validateFile(file, callback);
  }
}).single("file");

module.exports = uploadDocuments;
