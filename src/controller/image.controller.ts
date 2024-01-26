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

    const imageUrlList: string[] = [];

    await Promise.all(
      reqBody?.map(async (file: Express.Multer.File) => {
        const filePath = file?.path as string;
        const result = await uploadImageFile(filePath);
        imageUrlList.push(result?.secure_url || result?.url);
      })
    );

    // update user
    await Promise.all(
      imageUrlList?.map(async (image: string) => {
        await prisma.images.create({
          data: {
            imageUrl: image,
            userId: id as string,
          },
        });
      })
    );

    return res.status(200).json({
      success: true,
      message: "Files uploaded successfully",
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

const getAllImages = asyncHandler(async (req: Request, res: Response) => {
  const { limit, page } = req.query;

  const allimages = await prisma.images.findMany({
    ...(limit && { take: Number(limit) }),
    ...(limit && page && { skip: Number(limit) * (Number(page) - 1) }),
  });

  return res.status(200).json({
    success: true,
    docs: {
      total: allimages.length,
      page: page,
      limit: limit,
    },
    message: "Images fetched successfully",
    data: allimages,
  });
  
});

const imageController = {
  multipleImage,
  getMultipleImageById,
  getAllImages,
};

export default imageController;
