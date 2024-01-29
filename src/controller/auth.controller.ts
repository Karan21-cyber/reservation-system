import { Request, Response } from "express";
import HttpException from "../utils/HttpException";
import asyncHandler from "../utils/asyncHandler";
import bcrypt from "bcrypt";
import { getUserByEmail } from "../service/user.service";
import {
  getAccessToken,
  getAccessTokenAndRefereshToken,
  isRefereshTokenExpired,
} from "../service/getToken";
import prisma from "../prisma";

const userLogin = asyncHandler(async (req: Request, res: Response) => {
  const reqBody = req.body;
  const email = reqBody.email.trim().toLowerCase();

  const user = await getUserByEmail(email);

  if (!user) throw new HttpException(400, "User not found");

  const comparePassword = await bcrypt.compare(
    reqBody?.password,
    user?.password
  );

  if (!comparePassword) throw new HttpException(400, "Invalid Credential.");

  const token = await getAccessTokenAndRefereshToken(user?.id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", token?.accessToken, options)
    .cookie("refreshToken", token?.refreshToken, options)
    .json({
      success: true,
      message: "User logged in successfully",
      data: {
        id: user?.id,
        email: user?.email,
        name: user?.name,
        phone: user?.phone,
        image: user?.image,
        address: user?.address,
        token: token?.accessToken,
        refreshToken: token?.refreshToken,
        createdAt: user?.createdAt,
        updatedAt: user?.updatedAt,
      },
    });
});

const userLogOut = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  // const { refreshToken } = req.query;

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!user) throw new HttpException(400, "User not found");

  await prisma.user.update({
    where: {
      id: user?.id,
    },
    data: {
      refreshToken: null || undefined || "",
    },
  });

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .cookie("refreshToken", null, options)
    .cookie("accessToken", null, options)
    .json({
      success: true,
      message: "User logged out successfully",
    });
});

const refreshLogin = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.query;

  const user = await prisma.user.findFirst({
    where: {
      refreshToken: refreshToken as string,
    },
  });

  if (!user) throw new HttpException(400, "User not found");

  const isExpired = isRefereshTokenExpired(user?.refreshToken as string);
  const options = { httpOnly: true, secure: true };

  if (isExpired) {
    await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        refreshToken: null || undefined || "",
      },
    });

    return res
      .status(401)
      .cookie("refreshToken", null, options)
      .cookie("accessToken", null, options)
      .json({
        success: false,
        message: "Refresh token expired. Please login again.",
      });
  } else {
    const accessToken = getAccessToken(user?.id);
    return res.cookie("accessToken", accessToken, options).status(200).json({
      success: true,
      data: {
        accessToken,
      },
    });
  }
});

const authController = { userLogin, userLogOut, refreshLogin };

export default authController;
