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
exports.imageServiceUpdate = exports.imageServiceCreate = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const prisma_1 = __importDefault(require("../prisma"));
const imageServiceCreate = (fileName, result, id) => __awaiter(void 0, void 0, void 0, function* () {
    const createImage = yield prisma_1.default.userImage.create({
        data: {
            name: fileName,
            publicId: result.public_id,
            image: result.secure_url || result.url,
            format: result.format,
            userId: id,
        },
        select: {
            id: true,
            name: true,
            publicId: true,
            image: true,
            format: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return createImage;
});
exports.imageServiceCreate = imageServiceCreate;
const imageServiceUpdate = (fileName, result, id, imageId) => __awaiter(void 0, void 0, void 0, function* () {
    const updateImage = yield prisma_1.default.userImage.update({
        where: { id: imageId },
        data: {
            name: fileName,
            publicId: result.public_id,
            image: result.secure_url || result.url,
            format: result.format,
            userId: id,
        },
        select: {
            id: true,
            name: true,
            publicId: true,
            image: true,
            format: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return updateImage;
});
exports.imageServiceUpdate = imageServiceUpdate;
