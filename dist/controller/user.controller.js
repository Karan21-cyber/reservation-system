"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const prisma_1 = __importDefault(require("../prisma"));
const HttpException_1 = __importDefault(require("../utils/HttpException"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const delete_file_1 = require("../service/delete.file");
const upload_file_1 = require("../service/upload.file");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_service_1 = require("../service/user.service");
const createUser = (0, asyncHandler_1.default)(async (req, res) => {
    const reqBody = req.body;
    const email = reqBody.email.trim().toLowerCase();
    const userExist = await (0, user_service_1.getUserByEmail)(email);
    if (userExist)
        throw new HttpException_1.default(400, "User already exist");
    const password = reqBody === null || reqBody === void 0 ? void 0 : reqBody.password;
    const hashpassword = await bcrypt_1.default.hash(password, 10);
    const user = await prisma_1.default.user.create({
        data: Object.assign(Object.assign({}, reqBody), { email, password: hashpassword }),
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            image: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user,
    });
});
const uploadImage = async (req, // Correcting the type of 'files'
res) => {
    const reqBody = req === null || req === void 0 ? void 0 : req.file;
    const { id } = (req === null || req === void 0 ? void 0 : req.params) || {};
    const filePath = reqBody === null || reqBody === void 0 ? void 0 : reqBody.path;
    const userImage = await (0, user_service_1.getUserDataById)(id);
    let result;
    //   delete previous image and upload new image
    if (userImage === null || userImage === void 0 ? void 0 : userImage.image) {
        // delete previous and update new one
        await (0, delete_file_1.deleteImage)(userImage === null || userImage === void 0 ? void 0 : userImage.image);
        result = await (0, upload_file_1.uploadImageFile)(filePath);
    }
    else {
        // create new image
        result = await (0, upload_file_1.uploadImageFile)(filePath);
    }
    // update user
    await prisma_1.default.user.update({
        where: { id: id },
        data: {
            image: (result === null || result === void 0 ? void 0 : result.secure_url) || (result === null || result === void 0 ? void 0 : result.url),
        },
    });
    return res.status(200).json({
        message: "Successfully uploaded files",
        data: {
            public_id: result === null || result === void 0 ? void 0 : result.public_id,
            image: (result === null || result === void 0 ? void 0 : result.secure_url) || (result === null || result === void 0 ? void 0 : result.url),
        },
    });
};
const getUserById = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const user = await (0, user_service_1.getUserDataById)(id);
    return res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: user,
    });
});
const getAllUser = (0, asyncHandler_1.default)(async (req, res) => {
    const users = await prisma_1.default.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            image: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: users,
    });
});
const userController = {
    createUser,
    uploadImage,
    getUserById,
    getAllUser,
};
exports.default = userController;
