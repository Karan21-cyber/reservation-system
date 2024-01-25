/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "../prisma";
import HttpException from "../utils/HttpException";
import asyncHandler from "../utils/asyncHandler";
import { Request, Response } from "express";
import { deleteImage } from "../service/delete.file";
import { uploadImageFile } from "../service/upload.file";
import bcrypt from "bcrypt";

const createUser = asyncHandler(async (req: Request, res: Response) => {
  const reqBody = req.body;
  const email = reqBody.email.trim().toLowerCase();

  const userExist = await prisma.user.findUnique({
    where: { email: email },
  });

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
  const { id }: any = req?.params;

  const filePath = reqBody?.path as any;

  const userImage = await prisma?.user?.findUnique({
    where: { id: id as string },
  });

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
  const user = await prisma.user.findUnique({
    where: { id: id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: user,
  });
});

const userController = {
  createUser,
  uploadImage,
  getUserById,
};

export default userController;
