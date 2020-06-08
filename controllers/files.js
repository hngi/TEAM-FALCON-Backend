const File = require("../models/file.model");
const response = require("../utils/response");
const CustomError = require("../utils/CustomError");

/**
 * Controllers for :
 *
 * getFiles
 * getFile,
 * createFile,
 * updateFile,
 * deleteFile
 */
class FileContoller {
  // Get one file
  async getFile(req, res) {
    await File.findOne({ _id: req.params.fileId }, (err, file) => {
      if (err) throw new CustomError("Error occured while retriving files");


      if (!file) return res.status(404).json(response("File Not Found", null, false))

      res.status(200).json(response("All Files Found", file, true))
    })


      if (!file)
        return res.status(404).json(response("File Not Found", null, false));

      res.status(200).json(response("All Files Found", file, true));
    });

  }
  //route handler to get all files
  async getFiles(req, res) {
    let files = await File.find();
<<<<<<< HEAD
=======


>>>>>>> 746e0c66ce8226cb0a192fd649bc2221a1844d70
    if (!files) return res.status(200).json(response("No Files Found", files, true))
    return res.status(200).json(response("All Files Found", files, true))
  }
  // Delete one file
  deleteFile(req, res) {
    File.deleteOne({ _id: req.params.id }).then(() => {
      res.status(200).json({
        status: true,
        message: "File Deleted",
      });

    if (!files)
      return res.status(200).json(response("No Files Found", files, true));

    return res.status(200).json(response("All Files Found", files, true));
  }

  async deleteFile(req, res) {
    const file = await File.deleteOne({ _id: req.params.id }, (err, file) => {
      if (err) throw new CustomError("Error occured while deleting file");
      if (!file)
        return res.status(404).json(response("File Not Found", null, false));

      res.status(200).json(response("File Deleted", null, true));

    });
  }
  async updateFile(req, res, next) {
    await   File.findOneAndUpdate(
        {_id:req.params.fileId} 
        ,req.body,
        {new:true},
        (err,file)=>{
                if (err) throw new CustomError("Error occured while retriving files");
                 res.status(200).json(response("file updated", file, true)); 
        });
      }
}

module.exports = new FileContoller();
