"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validationMiddleware = (schema) => {
    return async (req, res, next) => {
        var _a;
        try {
            schema.parse({
                body: req.body,
                params: req.params,
                query: req.query,
            });
            next();
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: (_a = error.issues[0]) === null || _a === void 0 ? void 0 : _a.message,
                issues: error.issues,
            });
        }
    };
};
exports.default = validationMiddleware;
