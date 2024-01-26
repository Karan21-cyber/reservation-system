"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageFile = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const fs_1 = __importDefault(require("fs"));
const HttpException_1 = __importDefault(require("../utils/HttpException"));
const upload = (0, multer_1.default)({
    dest: "./uploads",
});
exports.default = upload;
const uploadImageFile = async (filePath) => {
    const result = await cloudinary_1.default.uploader.upload(filePath);
    if (!result) {
        throw new HttpException_1.default(400, "Unable to upload file.");
    }
    fs_1.default.unlinkSync(filePath);
    return result;
};
exports.uploadImageFile = uploadImageFile;
