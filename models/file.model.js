const mongoose = require('mongoose');
const shortid = require('shortid');

//define database schema & model for posts
const fileSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: shortid.generate
    },
    title: {
      type: String,
      required: true
    },
    fileURL: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  });

const File = mongoose.model("Files", fileSchema);

module.exports = File;