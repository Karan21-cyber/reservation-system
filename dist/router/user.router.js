"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const upload_file_1 = __importDefault(require("../service/upload.file"));
const router = (0, express_1.Router)();
router.post("/v1/user", (0, asyncHandler_1.default)(user_controller_1.default.createUser));
router.get("/v1/user/:id", (0, asyncHandler_1.default)(user_controller_1.default.getUserById));
router.put("/v1/user/image/:id", upload_file_1.default.single("image"), (0, asyncHandler_1.default)(user_controller_1.default.uploadImage));
const userRouter = router;
exports.default = userRouter;
