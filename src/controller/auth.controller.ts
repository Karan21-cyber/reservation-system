import { Request, Response } from "express";
import prisma from "../prisma";
import HttpException from "../utils/HttpException";
import asyncHandler from "../utils/asyncHandler";
import bcrypt from "bcrypt";

const userLogin = asyncHandler(async (req: Request, res: Response) => {
  const reqBody = req.body;
  const email = reqBody.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) throw new HttpException(400, "User not found");

  const comparePassword = await bcrypt.compare(
    reqBody?.password,
    user?.password
  );

  if (!comparePassword) throw new HttpException(400, "Invalid Credential.");

  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: {
      id: user?.id,
      email: user?.email,
      name: user?.name,
      phone: user?.phone,
      image: user?.image,
      address: user?.address,
      createdAt: user?.createdAt,
      updatedAt: user?.updatedAt,
    },
  });
});

const authController = { userLogin };

export default authController;
