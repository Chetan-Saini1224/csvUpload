import express from "express";
import {
  getFileData,
  uploadFile,
  index,
} from "../controllers/homecontroller.js";

const router = express.Router();

router.get("/", index);
router.post("/uploadFile", uploadFile);
router.post("/getFileData", getFileData);

export default router;
