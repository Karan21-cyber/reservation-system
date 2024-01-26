"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("./prisma"));
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
const user_router_1 = __importDefault(require("./router/user.router"));
const auth_router_1 = __importDefault(require("./router/auth.router"));
const video_router_1 = __importDefault(require("./router/video.router"));
const image_router_1 = __importDefault(require("./router/image.router"));
const schedular_job_1 = __importDefault(require("./scheduler/schedular.job"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", async (req, res) => {
    return res.status(200).json({
        success: true,
        code: 200,
        message: "Welcome to reservation-system. Server is running...",
    });
});
//router
app.use(user_router_1.default, auth_router_1.default, video_router_1.default, image_router_1.default);
app.use(error_middleware_1.default);
//scheduler method invoke
schedular_job_1.default.jobScheduler;
prisma_1.default
    .$connect()
    .then(() => {
    const PORT = 3800;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
    });
})
    .catch((e) => {
    console.log("Error: ", e);
});
