"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler = (controller) => {
    return async (req, res, next) => {
        try {
            await controller(req, res);
        }
        catch (err) {
            console.log("Error: ", err);
            return next(err);
        }
    };
};
exports.default = asyncHandler;
