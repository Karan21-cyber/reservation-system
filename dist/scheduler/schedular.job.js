"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_schedule_1 = __importDefault(require("node-schedule"));
const prisma_1 = __importDefault(require("../prisma"));
const user_service_1 = require("../service/user.service");
// schedule on the basis of time
const rule = new node_schedule_1.default.RecurrenceRule();
rule.hour = 1;
// const rule = "*/10 * * * * *"  // every 10 seconds
const jobScheduler = node_schedule_1.default.scheduleJob(rule, async () => {
    console.log("Job Run : ", new Date().toLocaleString());
    const userId = await (0, user_service_1.getUserDataById)("7a675d74-f79b-42f2-a89e-d39fafce1db8");
    if (userId) {
        const result = await prisma_1.default.user.delete({
            where: {
                id: userId.id,
            },
        });
        if (result) {
            console.log("User deleted successfully");
        }
    }
});
const job = {
    jobScheduler,
};
exports.default = job;
