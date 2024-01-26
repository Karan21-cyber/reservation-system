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
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const getId_service_1 = require("../service/getId.service");
const video_service_1 = require("../service/video.service");
const prisma_1 = __importDefault(require("../prisma"));
const uploadVideo = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqBody = req.file;
    const { id } = req.params;
    const filePath = reqBody === null || reqBody === void 0 ? void 0 : reqBody.path;
    const fileName = reqBody === null || reqBody === void 0 ? void 0 : reqBody.originalname;
    const videoUpload = yield (0, video_service_1.videoUploader)(filePath, fileName);
    const creates = yield (0, video_service_1.videoCreate)(videoUpload, id);
    return res.status(200).json({
        success: true,
        message: "Video uploaded successfully",
        data: creates,
    });
}));
const getAllVideos = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page } = req.query;
    const videos = yield prisma_1.default.videos.findMany(Object.assign(Object.assign({}, (limit && { take: Number(limit) })), (limit && page && { skip: Number(limit) * (Number(page) - 1) })));
    return res.status(200).json({
        success: true,
        docs: {
            total: videos.length,
            page: page,
            limit: limit,
        },
        message: "Videos fetched successfully",
        data: videos,
    });
}));
const getVideosById = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { page, limit } = req.query;
    const videos = yield prisma_1.default.videos.findMany(Object.assign(Object.assign({ where: {
            userId: id,
        } }, (limit && { take: Number(limit) })), (limit && page && { skip: Number(limit) * (Number(page) - 1) })));
    return res.status(200).json({
        success: true,
        docs: {
            total: videos.length,
            page: page,
            limit: limit,
        },
        message: "Videos fetched successfully",
        data: videos,
    });
}));
const deleteVideo = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = req.query;
    const videoId = (0, getId_service_1.getVideoId)(url);
    const video = yield prisma_1.default.videos.findUnique({
        where: {
            videoUrl: url,
        },
    });
    if (video) {
        yield prisma_1.default.videos.delete({
            where: {
                videoUrl: url,
            },
        });
    }
    yield (0, video_service_1.videoRemover)(videoId);
    return res.status(200).json({
        success: true,
        message: "Video deleted successfully",
    });
}));
const videoController = {
    uploadVideo,
    deleteVideo,
    getAllVideos,
    getVideosById,
};
exports.default = videoController;
