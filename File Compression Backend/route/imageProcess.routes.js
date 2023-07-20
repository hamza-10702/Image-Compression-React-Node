const express = require("express");
const multer = require("multer");
const fs = require("fs");
const {
  compressImage,
  sendImages,
} = require("../controller/imageProcess.controller");
const route = express.Router();

// let storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const path = `src/images`;
//     fs.mkdirSync(path, { recursive: true });
//     cb(null, path);
//   },
//   filename: (request, file, cb) => {
//     console.log({ file });
//     const ext = file.originalname.split(".")[1];
//     cb(null, file.fieldname + "-" + Date.now() + `.${ext}`);
//   },
//   fileFilter: function (req, file, cb) {
//     if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
//       req.fileValidationError = "Only image files are allowed!";
//       return cb(null, false);
//     }
//     cb(null, true);
//   },
// });

// const getImage = multer({
//   storage: storage,
// });

// route.post("/image", getImage.array("image", 12), compressImage);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array("images");
const handleFileUpload = (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    req.body.images = req.files.map((file) => file.buffer); // Assign the file buffers to the request body

    next();
  });
};
route.post("/image", handleFileUpload, compressImage);
route.get("/image", sendImages);

module.exports = route;
