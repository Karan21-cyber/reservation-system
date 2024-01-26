"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDataById = exports.getUserByEmail = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const getUserByEmail = async (email) => {
    const user = await prisma_1.default.user.findUnique({
        where: {
            email: email,
        },
    });
    return user;
};
exports.getUserByEmail = getUserByEmail;
const getUserDataById = async (userId) => {
    const user = await prisma_1.default.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            role: true,
            image: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return user;
};
exports.getUserDataById = getUserDataById;
