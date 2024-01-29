"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = __importDefault(require("../utils/HttpException"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_service_1 = require("../service/user.service");
const getToken_1 = require("../service/getToken");
const prisma_1 = __importDefault(require("../prisma"));
const userLogin = (0, asyncHandler_1.default)(async (req, res) => {
    const reqBody = req.body;
    const email = reqBody.email.trim().toLowerCase();
    const user = await (0, user_service_1.getUserByEmail)(email);
    if (!user)
        throw new HttpException_1.default(400, "User not found");
    const comparePassword = await bcrypt_1.default.compare(reqBody === null || reqBody === void 0 ? void 0 : reqBody.password, user === null || user === void 0 ? void 0 : user.password);
    if (!comparePassword)
        throw new HttpException_1.default(400, "Invalid Credential.");
    const token = await (0, getToken_1.getAccessTokenAndRefereshToken)(user === null || user === void 0 ? void 0 : user.id);
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .cookie("accessToken", token === null || token === void 0 ? void 0 : token.accessToken, options)
        .cookie("refreshToken", token === null || token === void 0 ? void 0 : token.refreshToken, options)
        .json({
        success: true,
        message: "User logged in successfully",
        data: {
            id: user === null || user === void 0 ? void 0 : user.id,
            email: user === null || user === void 0 ? void 0 : user.email,
            name: user === null || user === void 0 ? void 0 : user.name,
            phone: user === null || user === void 0 ? void 0 : user.phone,
            image: user === null || user === void 0 ? void 0 : user.image,
            address: user === null || user === void 0 ? void 0 : user.address,
            token: token === null || token === void 0 ? void 0 : token.accessToken,
            refreshToken: token === null || token === void 0 ? void 0 : token.refreshToken,
            createdAt: user === null || user === void 0 ? void 0 : user.createdAt,
            updatedAt: user === null || user === void 0 ? void 0 : user.updatedAt,
        },
    });
});
const userLogOut = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    // const { refreshToken } = req.query;
    const user = await prisma_1.default.user.findUnique({
        where: {
            id: id,
        },
    });
    if (!user)
        throw new HttpException_1.default(400, "User not found");
    await prisma_1.default.user.update({
        where: {
            id: user === null || user === void 0 ? void 0 : user.id,
        },
        data: {
            refreshToken: null,
        },
    });
    const options = { httpOnly: true, secure: true };
    return res
        .status(200)
        .cookie("refreshToken", null, options)
        .cookie("accessToken", null, options)
        .json({
        success: true,
        message: "User logged out successfully",
    });
});
const refreshLogin = (0, asyncHandler_1.default)(async (req, res) => {
    const { refreshToken } = req.query;
    const user = await prisma_1.default.user.findFirst({
        where: {
            refreshToken: refreshToken,
        },
    });
    if (!user)
        throw new HttpException_1.default(400, "User not found");
    const isExpired = (0, getToken_1.isRefereshTokenExpired)(user === null || user === void 0 ? void 0 : user.refreshToken);
    if (isExpired) {
        await prisma_1.default.user.update({
            where: {
                id: user === null || user === void 0 ? void 0 : user.id,
            },
            data: {
                refreshToken: null,
            },
        });
        const options = { httpOnly: true, secure: true };
        return res
            .status(401)
            .cookie("refreshToken", null, options)
            .cookie("accessToken", null, options)
            .json({
            success: false,
            message: "Refresh token expired. Please login again.",
        });
    }
    else {
        const accessToken = (0, getToken_1.getAccessToken)(user === null || user === void 0 ? void 0 : user.id);
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
                token: accessToken,
                refreshToken: user === null || user === void 0 ? void 0 : user.refreshToken,
                createdAt: user === null || user === void 0 ? void 0 : user.createdAt,
                updatedAt: user === null || user === void 0 ? void 0 : user.updatedAt,
            },
        });
    }
});
const authController = { userLogin, userLogOut, refreshLogin };
exports.default = authController;
