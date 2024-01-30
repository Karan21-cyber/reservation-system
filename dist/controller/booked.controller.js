"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../prisma"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const HttpException_1 = __importDefault(require("../utils/HttpException"));
const createbooked = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const reqBody = req.body;
    const slotExist = await prisma_1.default.booked.findFirst({
        where: {
            slotId: reqBody === null || reqBody === void 0 ? void 0 : reqBody.slotId,
        },
    });
    if (slotExist)
        throw new HttpException_1.default(409, "Slot already booked.");
    const booked = await prisma_1.default.booked.create({
        data: Object.assign(Object.assign({}, reqBody), { userId: id }),
    });
    return res.status(201).json({
        success: true,
        message: "Slot booked successfully.",
        data: booked,
    });
});
const getAllbooked = (0, asyncHandler_1.default)(async (req, res) => {
    const booked = await prisma_1.default.booked.findMany();
    return res.status(200).json({
        success: true,
        message: "Booked fetched successfully.",
        data: booked,
    });
});
const getBookedDataByUserId = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const booked = await prisma_1.default.booked.findMany({
        where: {
            userId: id,
        },
    });
    return res.status(200).json({
        success: true,
        message: "Booked fetched successfully.",
        data: booked,
    });
});
const getBookedDataBySlotId = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const booked = await prisma_1.default.booked.findMany({
        where: {
            slotId: id,
        },
        include: {
            slots: true,
        },
    });
    return res.status(200).json({
        success: true,
        message: "Booked fetched successfully.",
        data: booked,
    });
});
const bookedController = {
    createbooked,
    getAllbooked,
    getBookedDataByUserId,
    getBookedDataBySlotId,
};
exports.default = bookedController;
