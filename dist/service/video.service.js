"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const videoUploader = (filePath, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const videoCredentialPayload = {
        title: fileName || "Untitled",
        description: "This is  videos description.",
    };
    const video = yield client.videos.create(videoCredentialPayload);
    const videoUpload = yield client.videos.upload(video === null || video === void 0 ? void 0 : video.videoId, filePath);
    // remove file from upload directory
    fs_1.default.unlinkSync(filePath);
    return videoUpload;
});
exports.videoUploader = videoUploader;
const videoRemover = (videoId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield client.videos.delete(videoId);
    return result;
});
exports.videoRemover = videoRemover;
const videoCreate = (videoUpload, id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const video = yield prisma_1.default.videos.create({
        data: {
            name: videoUpload === null || videoUpload === void 0 ? void 0 : videoUpload.title,
            videoUrl: (_a = videoUpload === null || videoUpload === void 0 ? void 0 : videoUpload.assets) === null || _a === void 0 ? void 0 : _a.mp4,
            thumbnail: (_b = videoUpload === null || videoUpload === void 0 ? void 0 : videoUpload.assets) === null || _b === void 0 ? void 0 : _b.thumbnail,
            userId: id,
        },
    });
    return video;
});
exports.videoCreate = videoCreate;
const videoUpdate = (videoUpload, url) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const video = yield prisma_1.default.videos.update({
        where: {
            id: url,
        },
        data: {
            name: videoUpload === null || videoUpload === void 0 ? void 0 : videoUpload.title,
            videoUrl: (_c = videoUpload === null || videoUpload === void 0 ? void 0 : videoUpload.assets) === null || _c === void 0 ? void 0 : _c.mp4,
            thumbnail: (_d = videoUpload === null || videoUpload === void 0 ? void 0 : videoUpload.assets) === null || _d === void 0 ? void 0 : _d.thumbnail,
        },
    });
    return video;
});
exports.videoUpdate = videoUpdate;
