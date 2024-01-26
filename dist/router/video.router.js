"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const video_controller_1 = __importDefault(require("../controller/video.controller"));
const upload_file_1 = __importDefault(require("../service/upload.file"));
const router = (0, express_1.Router)();
router.put("/v1/video/:id", upload_file_1.default.single("video"), video_controller_1.default.uploadVideo);
router.get("/v1/video/:id", video_controller_1.default.getVideosById);
router.get("/v1/video", video_controller_1.default.getAllVideos);
router.delete("/v1/video", video_controller_1.default.deleteVideo);
const videoRouter = router;
exports.default = videoRouter;
