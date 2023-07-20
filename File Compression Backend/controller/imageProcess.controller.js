const sharp = require("sharp");
const streamifier = require("streamifier");
const imageModel = require("../model/image.model");
const cloudinaryConfig = require("cloudinary").v2;
const fs = require("fs");
const { sendMail } = require("./mail.controller");
const { myQueue } = require("../constant");
const io = require("../index");

cloudinaryConfig.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.APIKEY,
  api_secret: process.env.API_SECRET,
});

// =============================================================================
//                     Upload Images API
// =============================================================================
const compressImage = async (req, res) => {
  const imageData = req.body.images;
  const email = req.body.email;

  try {
    if (imageData.length > 0 && email) {
      myQueue.add("processingImages", { imageData, email });
      const isuserExist = await imageModel.findOne({ email });
      if (isuserExist) {
        //   console.log({ message: "User already Exist" });
      } else {
        const newUserData = new imageModel({
          email,
          links: [],
        });

        const newUser = await newUserData.save();
        // console.log("New User Created", newUser);
      }

      return res.json({
        message:
          "Success! Image has been upload you might wait some time after compressing you will notify through Mail!",
      });
    } else {
      return res.json({
        message: "Email or Images not found",
      });
    }
  } catch (error) {
    return res.json({ error: error });
  }
};
//=============================================================================
//                    Processing Images API
// =============================================================================

const saveImagesToCloud = async (images) => {
  let allImages = [];
  for (let file of images) {
    const compress = await sharp(Buffer.from(file))
      .resize(1000)
      .png({ quality: 30 });
    const compressedBuffer = await compress.toBuffer();

    const uploadImages = new Promise((resolve, reject) => {
      const stream = cloudinaryConfig.uploader.upload_stream(
        (error, result) => {
          if (result) {
            const newImage = {
              url: result.url,
              bytes: result.bytes,
              asset_id: result.asset_id,
              original_filename: result.original_filename,
              date: Date.now(),
            };
            // console.log(newImage);
            allImages.push(newImage);

            // console.log("File uploaded to Cloudinary", result);
            resolve();
          } else {
            reject(error);
          }
        }
      );
      streamifier.createReadStream(compressedBuffer).pipe(stream);
    });

    try {
      await uploadImages;
    } catch (error) {
      return {
        error,
      };
    }
  }
  return allImages;
};
const imageProcessingAsync = async (data) => {
  console.log(
    "-----------------------------------------------------------------------------------------------------------------------------------------",
    process.env.CLOUD_NAME
  );

  const { imageData, email } = data;
  const links = await saveImagesToCloud(imageData);

  try {
    if (links.length > 0) {
      const isuserExist = await imageModel.findOne({ email });
      if (isuserExist) {
        const updateUser = await imageModel.findByIdAndUpdate(
          { _id: isuserExist._id },
          { $push: { links: links } },
          { new: true }
        );
        // console.log({ urls: updateUser });
      } else {
        // console.log({ message: "No User Found" });
      }

      return {
        data: links,
      };
    }
  } catch (error) {
    // console.log(error);
  }
};

// ======================================================================================
//                                  Send Compressed Images
// ======================================================================================

const sendImages = async (req, res) => {
  const email = req.query.email.toString();
  try {
    const userData = await getImagesFromDatabase(email);
    if (userData) {
      return res.json({ message: "Image data received", data: userData });
    } else {
      return res.json({
        error: "No corresponding image was found for this email!!!",
      });
    }
  } catch (error) {
    return res.json({ error: error });
  }
};

const getImagesFromDatabase = async (email) => {
  try {
    const userImages = await imageModel.findOne({ email });
    if (userImages) {
      return userImages;
    } else {
      return null;
    }
  } catch (error) {
    // console.log(error);
  }
};

// ======================================================================================
//                                   Create Que
// ======================================================================================

// Define a task
const myTask = async (data) => {
  imageProcessingAsync(data);
};

// Process jobs in the queue
myQueue.process("processingImages", (job) => {
  const { data } = job;
  myTask(data);
});
// Listen for completed tasks
myQueue.on("completed", async (job) => {
  // console.log("Task completed:", job.data);
  const userData = await getImagesFromDatabase(job?.data?.email);
  if (userData) {
    const urls = userData?.links?.map((image) => image.url);
    //  console.log({ email: userData?.email, urls });
    sendMail({ email: userData?.email, urls });
  }
});

// Listen for errors
myQueue.on("failed", (job, error) => {
  console.log("Task failed:", job.data, error);
});

module.exports = {
  compressImage,
  sendImages,
};
