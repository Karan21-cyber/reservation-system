/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";

import asyncHandler from "../utils/asyncHandler";
import { getVideoId } from "../service/getId.service";
import {
  videoCreate,
  videoRemover,
  videoUploader,
} from "../service/video.service";
import prisma from "../prisma";

const uploadVideo = asyncHandler(async (req: Request, res: Response) => {
  const reqBody = req.file;
  const { id } = req.params;

  const filePath = reqBody?.path as any;
  const fileName = reqBody?.originalname as any;

  const videoUpload = await videoUploader(filePath, fileName);

  const creates = await videoCreate(videoUpload, id);

  return res.status(200).json({
    success: true,
    message: "Video uploaded successfully",
    data: creates,
  });
});

const getAllVideos = asyncHandler(async (req: Request, res: Response) => {
  const { limit, page } = req.query;

  const videos = await prisma.videos.findMany({
    ...(limit && { take: Number(limit) }),
    ...(limit && page && { skip: Number(limit) * (Number(page) - 1) }),
  });
  return res.status(200).json({
    success: true,
    docs: {
      total: videos.length,
      page: page,
      limit: limit,
    },
    message: "Videos fetched successfully",
    data: videos,
  });
});

const getVideosById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { page, limit } = req.query;
  const videos = await prisma.videos.findMany({
    where: {
      userId: id,
    },
    ...(limit && { take: Number(limit) }),
    ...(limit && page && { skip: Number(limit) * (Number(page) - 1) }),
  });

  return res.status(200).json({
    success: true,
    docs: {
      total: videos.length,
      page: page,
      limit: limit,
    },
    message: "Videos fetched successfully",
    data: videos,
  });
});

const deleteVideo = asyncHandler(async (req: Request, res: Response) => {
  const { url } = req.query;
  const videoId = getVideoId(url);

  const video = await prisma.videos.findUnique({
    where: {
      videoUrl: url as string,
    },
  });

  if (video) {
    await prisma.videos.delete({
      where: {
        videoUrl: url as string,
      },
    });
  }

  await videoRemover(videoId);

  return res.status(200).json({
    success: true,
    message: "Video deleted successfully",
  });
});


const videoController = {
  uploadVideo,
  deleteVideo,
  getAllVideos,
  getVideosById,
  
};

export default videoController;
