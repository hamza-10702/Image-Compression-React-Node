const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    links: {
      type: [
        {
          url: String,
          asset_id: String,
          bytes: Number,
          original_filename: String,
          date: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      required: true,
    },
  },
  { timestamps: true }
);

const imageModel = mongoose.model("Images", ImageSchema);

module.exports = imageModel;
