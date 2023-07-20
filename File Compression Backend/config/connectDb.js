const mongoose = require("mongoose");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "image_compression",
};

const connectDb = async (Db_URL) => {
  try {
    await mongoose.connect(Db_URL, options);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDb;
