/* eslint-disable @typescript-eslint/no-explicit-any */
import multer from "multer";
import cloudinary from "../utils/cloudinary";
import fs from "fs";
import HttpException from "../utils/HttpException";

const upload = multer({
  dest: "./uploads",
});

export default upload;

export const uploadImageFile = async (filePath: any) => {
  const result = await cloudinary.uploader.upload(filePath);
  if (!result) {
    throw new HttpException(400, "Unable to upload file.");
  }
  fs.unlinkSync(filePath);
  return result;
};
