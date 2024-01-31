/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "../prisma";
import HttpException from "../utils/HttpException";
import asyncHandler from "../utils/asyncHandler";
import { Request, Response } from "express";
import { deleteImage } from "../service/delete.file";
import { uploadImageFile } from "../service/upload.file";
import bcrypt from "bcrypt";
import { getUserByEmail, getUserDataById } from "../service/user.service";

import formData from "form-data";
import Mailgun from "mailgun.js";
import nodemailer from "nodemailer";
import { mail_template } from "../service/mail-template";

const createUser = asyncHandler(async (req: Request, res: Response) => {
  const reqBody = req.body;
  const email = reqBody.email.trim().toLowerCase();

  const userExist = await getUserByEmail(email);

  if (userExist) throw new HttpException(400, "User already exist");

  const password = reqBody?.password;

  const hashpassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { ...reqBody, email, password: hashpassword },
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

const uploadImage = async (
  req: Request, // Correcting the type of 'files'
  res: Response
) => {
  const reqBody = req?.file;
  const { id }: any = req?.params || {};

  const filePath = reqBody?.path as any;

  const userImage = await getUserDataById(id);

  let result;
  //   delete previous image and upload new image

  if (userImage?.image) {
    // delete previous and update new one
    await deleteImage(userImage?.image);

    result = await uploadImageFile(filePath);
  } else {
    // create new image
    result = await uploadImageFile(filePath);
  }

  // update user
  await prisma.user.update({
    where: { id: id as string },
    data: {
      image: result?.secure_url || result?.url,
    },
  });

  return res.status(200).json({
    message: "Successfully uploaded files",
    data: {
      public_id: result?.public_id,
      image: result?.secure_url || result?.url,
    },
  });
};

const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await getUserDataById(id);

  return res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: user,
  });
});

const getAllUser = asyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
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

const sendMail = asyncHandler(async (req: Request, res: Response) => {
  const { email, name } = req.body;

  if (!email) throw new HttpException(400, "Email is required");
  if (!name) throw new HttpException(400, "Name is required");

  const mailgun = new Mailgun(formData);
  const client = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY as string,
  });

  console.log();

  const messageData = {
    from: "karan.chaudhary@aitc.ai",
    to: [`${email as string}`],
    subject: "Hello",
    text: "Testing some Mailgun awesomeness!",
    html: mail_template(name),
  };

  try {
    const mailsend = await client.messages.create(
      "sandbox2156b3bce62847a9b285fdf36bc12b33.mailgun.org",
      messageData
    );

    return res.status(200).json({
      success: true,
      message: "Mail sent successfully",
      data: mailsend,
    });
  } catch (error: any) {
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

const sendNodemailer = asyncHandler(async (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!email) throw new HttpException(400, "Email is required");
  if (!name) throw new HttpException(400, "Name is required");
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: false,
    service: "gmail",
    auth: {
      user: process.env.USER_MAIL as string,
      pass: process.env.PASSWORD_MAIL as string,
    },
  });

  const mailsend = await transporter.sendMail({
    from: process.env.USER_MAIL as string,
    to: `${email as string}`,
    subject: "Testing mail from nodemailer",
    text: `Hello ${name},\n\nThis is a test email sent from nodemailer.`,
    html: mail_template(name),
  });

  if (!mailsend) throw new HttpException(500, "Error sending mail");

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

export default userController;
