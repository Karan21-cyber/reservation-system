"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const prisma_1 = __importDefault(require("../prisma"));
const HttpException_1 = __importDefault(require("../utils/HttpException"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const delete_file_1 = require("../service/delete.file");
const upload_file_1 = require("../service/upload.file");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_service_1 = require("../service/user.service");
const form_data_1 = __importDefault(require("form-data"));
const mailgun_js_1 = __importDefault(require("mailgun.js"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const mail_template_1 = require("../service/mail-template");
const createUser = (0, asyncHandler_1.default)(async (req, res) => {
    const reqBody = req.body;
    const email = reqBody.email.trim().toLowerCase();
    const userExist = await (0, user_service_1.getUserByEmail)(email);
    if (userExist)
        throw new HttpException_1.default(400, "User already exist");
    const password = reqBody === null || reqBody === void 0 ? void 0 : reqBody.password;
    const hashpassword = await bcrypt_1.default.hash(password, 10);
    const user = await prisma_1.default.user.create({
        data: Object.assign(Object.assign({}, reqBody), { email, password: hashpassword }),
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            image: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user,
    });
});
const uploadImage = async (req, // Correcting the type of 'files'
res) => {
    const reqBody = req === null || req === void 0 ? void 0 : req.file;
    const { id } = (req === null || req === void 0 ? void 0 : req.params) || {};
    const filePath = reqBody === null || reqBody === void 0 ? void 0 : reqBody.path;
    const userImage = await (0, user_service_1.getUserDataById)(id);
    let result;
    //   delete previous image and upload new image
    if (userImage === null || userImage === void 0 ? void 0 : userImage.image) {
        // delete previous and update new one
        await (0, delete_file_1.deleteImage)(userImage === null || userImage === void 0 ? void 0 : userImage.image);
        result = await (0, upload_file_1.uploadImageFile)(filePath);
    }
    else {
        // create new image
        result = await (0, upload_file_1.uploadImageFile)(filePath);
    }
    // update user
    await prisma_1.default.user.update({
        where: { id: id },
        data: {
            image: (result === null || result === void 0 ? void 0 : result.secure_url) || (result === null || result === void 0 ? void 0 : result.url),
        },
    });
    return res.status(200).json({
        message: "Successfully uploaded files",
        data: {
            public_id: result === null || result === void 0 ? void 0 : result.public_id,
            image: (result === null || result === void 0 ? void 0 : result.secure_url) || (result === null || result === void 0 ? void 0 : result.url),
        },
    });
};
const getUserById = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const user = await (0, user_service_1.getUserDataById)(id);
    return res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: user,
    });
});
const getAllUser = (0, asyncHandler_1.default)(async (req, res) => {
    const users = await prisma_1.default.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            image: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: users,
    });
});
const sendMail = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, name } = req.body;
    if (!email)
        throw new HttpException_1.default(400, "Email is required");
    if (!name)
        throw new HttpException_1.default(400, "Name is required");
    const mailgun = new mailgun_js_1.default(form_data_1.default);
    const client = mailgun.client({
        username: "api",
        key: process.env.MAILGUN_API_KEY,
    });
    console.log();
    const messageData = {
        from: "karan.chaudhary@aitc.ai",
        to: [`${email}`],
        subject: "Hello",
        text: "Testing some Mailgun awesomeness!",
        html: (0, mail_template_1.mail_template)(name),
    };
    try {
        const mailsend = await client.messages.create("sandbox2156b3bce62847a9b285fdf36bc12b33.mailgun.org", messageData);
        return res.status(200).json({
            success: true,
            message: "Mail sent successfully",
            data: mailsend,
        });
    }
    catch (error) {
        console.error("Mailgun API Error:", error);
        if (error.response && error.response.status === 401) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Please check your Mailgun API credentials.",
            });
        }
        return res.status(500).json({
            success: false,
            message: "Error sending mail",
            error: error.message,
        });
    }
});
const sendNodemailer = (0, asyncHandler_1.default)(async (req, res) => {
    const { name, email } = req.body;
    if (!email)
        throw new HttpException_1.default(400, "Email is required");
    if (!name)
        throw new HttpException_1.default(400, "Name is required");
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: false,
        service: "gmail",
        auth: {
            user: process.env.USER_MAIL,
            pass: process.env.PASSWORD_MAIL,
        },
    });
    const mailsend = await transporter.sendMail({
        from: process.env.USER_MAIL,
        to: `${email}`,
        subject: "Testing mail from nodemailer",
        text: `Hello ${name},\n\nThis is a test email sent from nodemailer.`,
        html: (0, mail_template_1.mail_template)(name),
    });
    if (!mailsend)
        throw new HttpException_1.default(500, "Error sending mail");
    return res.status(200).json({
        success: true,
        message: "Mail sent successfully",
    });
});
const userController = {
    createUser,
    uploadImage,
    getUserById,
    getAllUser,
    sendMail,
    sendNodemailer,
};
exports.default = userController;
