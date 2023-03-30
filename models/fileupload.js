import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
const FILE_PATH = path.join("/uploads/");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileUploadSchema = new mongoose.Schema(
  {
    csvfile: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", FILE_PATH));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    req.filename = file.originalname;
    cb(null, file.fieldname + "-" + uniqueSuffix + ".csv");
  },
});
//file.fieldname mean field name : (avatar) prefix in file name

//static
//us this to upload file in locla storage
fileUploadSchema.statics.uploadedFile = multer({
  storage: storage,
  fileFilter: function (_req, file, cb) {
    checkFileType(file, cb);
  },
}).single("csvfile");

function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /csv/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    return cb(null, false);
  }
}

fileUploadSchema.statics.filePath = FILE_PATH;
const FileUpload = mongoose.model("csvFiles", fileUploadSchema);

export default FileUpload;
