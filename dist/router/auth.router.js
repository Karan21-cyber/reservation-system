"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controller/auth.controller"));
const router = (0, express_1.Router)();
router.post("/v1/login", auth_controller_1.default.userLogin);
router.post("/v1/logout/:id", auth_controller_1.default.userLogOut);
router.post("/v1/refresh", auth_controller_1.default.refreshLogin);
const authRouter = router;
exports.default = authRouter;
