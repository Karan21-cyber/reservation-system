"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicId = void 0;
const getPublicId = (imageurl) => {
    const imageSplit = imageurl.split("/");
    const publicId = imageSplit[imageSplit.length - 1].split(".")[0];
    return publicId;
};
exports.getPublicId = getPublicId;
