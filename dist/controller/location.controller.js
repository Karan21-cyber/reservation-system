"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const prisma_1 = __importDefault(require("../prisma"));
const createLocation = (0, asyncHandler_1.default)(async (req, res) => {
    const reqBody = req.body;
    const locationExist = await prisma_1.default.location.findFirst({
        where: {
            name: reqBody.name,
        },
    });
    if (locationExist)
        throw new Error("Location already exist.");
    const location = await prisma_1.default.location.create({
        data: reqBody,
    });
    return res.status(201).json({
        success: true,
        message: "Location created successfully.",
        data: location,
    });
});
const getLocations = (0, asyncHandler_1.default)(async (req, res) => {
    const locations = await prisma_1.default.location.findMany();
    return res.status(200).json({
        success: true,
        message: "Locations fetched successfully.",
        data: locations,
    });
});
const getSingleLocation = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const location = await prisma_1.default.location.findUnique({
        where: {
            id: id,
        },
    });
    return res.status(200).json({
        success: true,
        message: "Location fetched successfully.",
        data: location,
    });
});
const updateLocation = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const reqBody = req.body;
    const location = await prisma_1.default.location.update({
        where: {
            id: id,
        },
        data: reqBody,
    });
    return res.status(200).json({
        success: true,
        message: "Location updated successfully.",
        data: location,
    });
});
const deleteLocation = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    await prisma_1.default.location.delete({
        where: {
            id: id,
        },
    });
    return res.status(200).json({
        success: true,
        message: "Location deleted successfully.",
    });
});
const locationController = {
    createLocation,
    updateLocation,
    getLocations,
    getSingleLocation,
    deleteLocation,
};
exports.default = locationController;
