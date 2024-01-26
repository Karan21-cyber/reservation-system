"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoUpdate = exports.videoCreate = exports.videoRemover = exports.videoUploader = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const nodejs_client_1 = __importDefault(require("@api.video/nodejs-client"));
const fs_1 = __importDefault(require("fs"));
const prisma_1 = __importDefault(require("../prisma"));
// import prisma from "../prisma";
const client = new nodejs_client_1.default({
    apiKey: process.env.VIDEO_API_KEY,
});
const videoUploader = async (filePath, fileName) => {
    const videoCredentialPayload = {
        title: fileName || "Untitled",
        description: "This is  videos description.",
    };
    const video = await client.videos.create(videoCredentialPayload);
    const videoUpload = await client.videos.upload(video === null || video === void 0 ? void 0 : video.videoId, filePath);
    // remove file from upload directory
    fs_1.default.unlinkSync(filePath);
    return videoUpload;
};
exports.videoUploader = videoUploader;
const videoRemover = async (videoId) => {
    const result = await client.videos.delete(videoId);
    return result;
};
exports.videoRemover = videoRemover;
const videoCreate = async (videoUpload, id) => {
    var _a, _b;
    const video = await prisma_1.default.videos.create({
        data: {
            name: videoUpload === null || videoUpload === void 0 ? void 0 : videoUpload.title,
            videoUrl: (_a = videoUpload === null || videoUpload === void 0 ? void 0 : videoUpload.assets) === null || _a === void 0 ? void 0 : _a.mp4,
            thumbnail: (_b = videoUpload === null || videoUpload === void 0 ? void 0 : videoUpload.assets) === null || _b === void 0 ? void 0 : _b.thumbnail,
            userId: id,
        },
    });
    return video;
};
exports.videoCreate = videoCreate;
const videoUpdate = async (videoUpload, url) => {
    var _a, _b;
    const video = await prisma_1.default.videos.update({
        where: {
            id: url,
        },
        data: {
            name: videoUpload === null || videoUpload === void 0 ? void 0 : videoUpload.title,
            videoUrl: (_a = videoUpload === null || videoUpload === void 0 ? void 0 : videoUpload.assets) === null || _a === void 0 ? void 0 : _a.mp4,
            thumbnail: (_b = videoUpload === null || videoUpload === void 0 ? void 0 : videoUpload.assets) === null || _b === void 0 ? void 0 : _b.thumbnail,
        },
    });
    return video;
};
exports.videoUpdate = videoUpdate;
