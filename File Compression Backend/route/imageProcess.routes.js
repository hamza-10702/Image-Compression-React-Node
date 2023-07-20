const express = require("express");
const multer = require("multer");
const fs = require("fs");
const {
  compressImage,
  sendImages,
} = require("../controller/imageProcess.controller");
const route = express.Router();

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
