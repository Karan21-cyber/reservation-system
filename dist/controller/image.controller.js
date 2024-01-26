"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const prisma_1 = __importDefault(require("../prisma"));
const upload_file_1 = require("../service/upload.file");
const multipleImage = (0, asyncHandler_1.default)(async (req, // Correcting the type of 'files'
res) => {
    const reqBody = req.files;
    const { id } = req.params;
    const imageUrlList = [];
    await Promise.all(reqBody === null || reqBody === void 0 ? void 0 : reqBody.map(async (file) => {
        const filePath = file === null || file === void 0 ? void 0 : file.path;
        const result = await (0, upload_file_1.uploadImageFile)(filePath);
        imageUrlList.push((result === null || result === void 0 ? void 0 : result.secure_url) || (result === null || result === void 0 ? void 0 : result.url));
    }));
    // update user
    await Promise.all(imageUrlList === null || imageUrlList === void 0 ? void 0 : imageUrlList.map(async (image) => {
        await prisma_1.default.images.create({
            data: {
                imageUrl: image,
                userId: id,
            },
        });
    }));
    return res.status(200).json({
        success: true,
        message: "Files uploaded successfully",
    });
});
const getMultipleImageById = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const images = await prisma_1.default.images.findMany({
        where: {
            userId: id,
        },
    });
    return res.status(200).json({
        success: true,
        message: "Images fetched successfully",
        data: images,
    });
});
const getAllImages = (0, asyncHandler_1.default)(async (req, res) => {
    const { limit, page } = req.query;
    const allimages = await prisma_1.default.images.findMany(Object.assign(Object.assign({}, (limit && { take: Number(limit) })), (limit && page && { skip: Number(limit) * (Number(page) - 1) })));
    return res.status(200).json({
        success: true,
        docs: {
            total: allimages.length,
            page: page,
            limit: limit,
        },
        message: "Images fetched successfully",
        data: allimages,
    });
});
const imageController = {
    multipleImage,
    getMultipleImageById,
    getAllImages,
};
exports.default = imageController;
