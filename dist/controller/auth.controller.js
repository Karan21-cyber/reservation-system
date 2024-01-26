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
const HttpException_1 = __importDefault(require("../utils/HttpException"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_service_1 = require("../service/user.service");
const userLogin = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqBody = req.body;
    const email = reqBody.email.trim().toLowerCase();
    const user = yield (0, user_service_1.getUserByEmail)(email);
    if (!user)
        throw new HttpException_1.default(400, "User not found");
    const comparePassword = yield bcrypt_1.default.compare(reqBody === null || reqBody === void 0 ? void 0 : reqBody.password, user === null || user === void 0 ? void 0 : user.password);
    if (!comparePassword)
        throw new HttpException_1.default(400, "Invalid Credential.");
    return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: {
            id: user === null || user === void 0 ? void 0 : user.id,
            email: user === null || user === void 0 ? void 0 : user.email,
            name: user === null || user === void 0 ? void 0 : user.name,
            phone: user === null || user === void 0 ? void 0 : user.phone,
            image: user === null || user === void 0 ? void 0 : user.image,
            address: user === null || user === void 0 ? void 0 : user.address,
            createdAt: user === null || user === void 0 ? void 0 : user.createdAt,
            updatedAt: user === null || user === void 0 ? void 0 : user.updatedAt,
        },
    });
}));
const authController = { userLogin };
exports.default = authController;
