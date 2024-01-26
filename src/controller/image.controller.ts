import asyncHandler from "../utils/asyncHandler";
import prisma from "../prisma";
import { Request, Response } from "express";
import { uploadImageFile } from "../service/upload.file";

const multipleImage = asyncHandler(
  async (
    req: Request & { files: Express.Multer.File[] }, // Correcting the type of 'files'
    res: Response
  ) => {
    const reqBody = req.files;
    const { id } = req.params;

    console.log("filePath: ", reqBody);
    const imageUrlList: string[] = [];

    await Promise.all(
      reqBody?.map(async (file: Express.Multer.File) => {
        const filePath = file?.path as string;
        const result = await uploadImageFile(filePath);
        imageUrlList.push(result?.secure_url || result?.url);
      })
    );

    // update user
    const result = await prisma.images.create({
      data: {
        images: imageUrlList as string[],
        userId: id as string,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      data: result,
    });
  }
);

const getMultipleImageById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const images = await prisma.images.findMany({
      where: {
        userId: id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Images fetched successfully",
      data: images,
    });
  }
);

const imageController = {
  multipleImage,
  getMultipleImageById,
};

export default imageController;
