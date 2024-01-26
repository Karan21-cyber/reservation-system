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
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("./prisma"));
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
const user_router_1 = __importDefault(require("./router/user.router"));
const auth_router_1 = __importDefault(require("./router/auth.router"));
const video_router_1 = __importDefault(require("./router/video.router"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json({
        success: true,
        code: 200,
        message: "Welcome to reservation-system. Server is running...",
    });
}));
app.use(user_router_1.default, auth_router_1.default, video_router_1.default);
app.use(error_middleware_1.default);
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
