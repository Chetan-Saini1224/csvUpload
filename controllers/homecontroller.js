import FileUpload from "../models/fileupload.js";
import csv from "csvtojson";
import path from "path";
import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

export async function index(req, res) {
  try {
    let files = await FileUpload.find({});
    if (files.length > 0) {
      csv()
        .fromFile(path.join(__dirname + ".." + files[0].csvfile))
        .then((tabledata) => {
          return res.render("home", {
            tabledata,
            headings: Object.keys(tabledata[0]),
            files,
          });
        });
    } else {
      return res.render("home", {
        tabledata: [],
        headings: [],
        files,
      });
    }
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
}

export async function uploadFile(req, res) {
  try {
    FileUpload.uploadedFile(req, res, async function (err) {
      if (err) {
        console.log("Multerr Error :", err);
        return res.redirect("back");
      }

      if (req.file) {
        let filename = req.filename.substring(0, req.filename.length - 4);
        let exist = await FileUpload.findOne({ filename });
        if (exist) {
          return res.status(200).json({
            success: "File already exist",
          });
        }

        const file = await FileUpload.create({
          csvfile: FileUpload.filePath + req.file.filename,
          filename,
        });
        return res.status(200).json({
          filename,
          _id: file._id,
          success: "File Uploaded Successfully",
        });
      }
      return res.status(200).json({
        error: "No csv file found",
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      error: "Server Error..",
    });
  }
}

export async function getFileData(req, res) {
  try {
    const file = await FileUpload.findById(req.body.id);
    if (file) {
      csv()
        .fromFile(path.join(__dirname + ".." + file.csvfile))
        .then((tabledata) => {
          return res.status(200).json({
            tabledata,
            headings: Object.keys(tabledata[0]),
          });
        });
    } else {
      return res.status(200).json({
        success: "No file found..",
      });
    }
  } catch (err) {
    return res.status(200).json({
      error: "Internal Server Error...",
    });
  }
}
