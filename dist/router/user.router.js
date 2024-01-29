"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const upload_file_1 = __importDefault(require("../service/upload.file"));
const validation_middleware_1 = __importDefault(require("../middleware/validation.middleware"));
const user_schema_1 = require("../schema/user.schema");
const router = (0, express_1.Router)();
router.post("/v1/user", (0, validation_middleware_1.default)(user_schema_1.createUserSchema), user_controller_1.default.createUser);
router.get("/v1/user/:id", user_controller_1.default.getUserById);
router.get("/v1/user", user_controller_1.default.getAllUser);
router.put("/v1/user/:id", (0, validation_middleware_1.default)(user_schema_1.updateUserSchema), user_controller_1.default.uploadImage);
router.put("/v1/user/image/:id", upload_file_1.default.single("image"), user_controller_1.default.uploadImage);
const userRouter = router;
exports.default = userRouter;
