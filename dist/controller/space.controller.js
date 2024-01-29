"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const prisma_1 = __importDefault(require("../prisma"));
const createSlotPromises = (totalSlot, spaceId) => {
    if (!totalSlot) {
        return [];
    }
    return Array(totalSlot)
        .fill("")
        .map(async (_, index) => {
        try {
            await prisma_1.default.slots.create({
                data: {
                    slotNo: index + 1,
                    spaceId: spaceId,
                },
            });
            return {
                success: true,
                message: "Slot created successfully.",
            };
        }
        catch (error) {
            return {
                success: false,
                message: "Unable to create slot.",
            };
        }
    });
};
const createspace = (0, asyncHandler_1.default)(async (req, res) => {
    const reqBody = req.body;
    const totalSlot = reqBody.totalSlots;
    const spaceExist = await prisma_1.default.space.findFirst({
        where: {
            name: reqBody.name,
        },
    });
    if (spaceExist)
        throw new Error("space already exist.");
    const space = await prisma_1.default.space.create({
        data: reqBody,
    });
    //creating slots
    Promise.allSettled(createSlotPromises(totalSlot, space === null || space === void 0 ? void 0 : space.id));
    return res.status(201).json({
        success: true,
        message: "space created successfully.",
        data: space,
    });
});
const getspaces = (0, asyncHandler_1.default)(async (req, res) => {
    const spaces = await prisma_1.default.space.findMany();
    if (!spaces)
        throw new Error("No spaces found.");
    return res.status(200).json({
        success: true,
        message: "spaces fetched successfully.",
        data: spaces,
    });
});
const getSinglespace = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const space = await prisma_1.default.space.findUnique({
        where: {
            id: id,
        },
    });
    if (!space)
        throw new Error("space not found.");
    return res.status(200).json({
        success: true,
        message: "space fetched successfully.",
        data: space,
    });
});
const updatespace = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const reqBody = req.body;
    const space = await prisma_1.default.space.update({
        where: {
            id: id,
        },
        data: reqBody,
    });
    return res.status(200).json({
        success: true,
        message: "space updated successfully.",
        data: space,
    });
});
const deletespace = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    await prisma_1.default.space.delete({
        where: {
            id: id,
        },
    });
    return res.status(200).json({
        success: true,
        message: "space deleted successfully.",
    });
});
const spaceController = {
    createspace,
    updatespace,
    getspaces,
    getSinglespace,
    deletespace,
};
exports.default = spaceController;
