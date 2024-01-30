"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const form_data_1 = __importDefault(require("form-data"));
const mailgun_js_1 = __importDefault(require("mailgun.js"));
const mailgun = new mailgun_js_1.default(form_data_1.default);
const client = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY,
});
const messageData = {
    from: "Excited User <me@samples.mailgun.org>",
    to: "foo@example.com, bar@example.com",
    subject: "Hello",
    text: "Testing some Mailgun awesomeness!",
};
const mailsend = client.messages
    .create("karan.chaudhary@aitc.ai", messageData)
    .then((res) => {
    console.log(res);
})
    .catch((err) => {
    console.error(err);
});
exports.default = mailsend;
