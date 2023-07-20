const Queue = require("bull");
const cloudinaryConfig = require("cloudinary").v2;

const myQueue = new Queue("myQueue", {
  redis: { port: 6379, host: "localhost" }, // Redis connection configuration
});

const cloudinary = cloudinaryConfig.config({
  cloud_name: "dj3pbrv12",
  api_key: "761173687514995",
  api_secret: "SgKwvjB7KCZ1Ijaik9VRP9OQiFw",
});

module.exports = {
  myQueue,
};
