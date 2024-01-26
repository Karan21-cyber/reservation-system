"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const image_controller_1 = __importDefault(require("../controller/image.controller"));
const upload_file_1 = __importDefault(require("../service/upload.file"));
const router = (0, express_1.Router)();
router.put("/v1/user/multipleimage/:id", upload_file_1.default.array("images"), image_controller_1.default.multipleImage);
const imageRouter = router;
exports.default = imageRouter;
