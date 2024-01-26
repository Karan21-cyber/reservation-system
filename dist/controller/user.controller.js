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
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-explicit-any */
const prisma_1 = __importDefault(require("../prisma"));
const HttpException_1 = __importDefault(require("../utils/HttpException"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const delete_file_1 = require("../service/delete.file");
const upload_file_1 = require("../service/upload.file");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_service_1 = require("../service/user.service");
const createUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqBody = req.body;
    const email = reqBody.email.trim().toLowerCase();
    const userExist = yield (0, user_service_1.getUserByEmail)(email);
    if (userExist)
        throw new HttpException_1.default(400, "User already exist");
    const password = reqBody === null || reqBody === void 0 ? void 0 : reqBody.password;
    const hashpassword = yield bcrypt_1.default.hash(password, 10);
    const user = yield prisma_1.default.user.create({
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
}));
const uploadImage = (req, // Correcting the type of 'files'
res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqBody = req === null || req === void 0 ? void 0 : req.file;
    const { id } = req === null || req === void 0 ? void 0 : req.params;
    const filePath = reqBody === null || reqBody === void 0 ? void 0 : reqBody.path;
    const userImage = yield (0, user_service_1.getUserDataById)(id);
    let result;
    //   delete previous image and upload new image
    if (userImage === null || userImage === void 0 ? void 0 : userImage.image) {
        // delete previous and update new one
        yield (0, delete_file_1.deleteImage)(userImage === null || userImage === void 0 ? void 0 : userImage.image);
        result = yield (0, upload_file_1.uploadImageFile)(filePath);
    }
    else {
        // create new image
        result = yield (0, upload_file_1.uploadImageFile)(filePath);
    }
    // update user
    yield prisma_1.default.user.update({
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
});
const getUserById = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield (0, user_service_1.getUserDataById)(id);
    return res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: user,
    });
}));
const userController = {
    createUser,
    uploadImage,
    getUserById,
};
exports.default = userController;
