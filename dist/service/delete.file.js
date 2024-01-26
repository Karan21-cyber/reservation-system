"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = void 0;
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const getId_service_1 = require("./getId.service");
const deleteImage = async (imageurl) => {
    const public_id = (0, getId_service_1.getPublicId)(imageurl);
    const result = await cloudinary_1.default.uploader.destroy(public_id, {
        invalidate: true,
    });
    return result;
};
exports.deleteImage = deleteImage;
