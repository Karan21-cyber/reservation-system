/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiVideoClient from "@api.video/nodejs-client";
import fs from "fs";
import prisma from "../prisma";
// import prisma from "../prisma";

const client = new ApiVideoClient({
  apiKey: process.env.VIDEO_API_KEY,
});

export const videoUploader = async (filePath: string, fileName: string) => {
  const videoCredentialPayload = {
    title: fileName || "Untitled",
    description: "This is  videos description.",
  };

  const video = await client.videos.create(videoCredentialPayload);

  const videoUpload = await client.videos.upload(video?.videoId, filePath);
  // remove file from upload directory
  fs.unlinkSync(filePath);
  return videoUpload;
};

export const videoRemover = async (videoId: string) => {
  const result = await client.videos.delete(videoId);
  return result;
};

export const videoCreate = async (videoUpload: any, id: string) => {
  const video = await prisma.videos.create({
    data: {
      name: videoUpload?.title,
      videoUrl: videoUpload?.assets?.mp4,
      thumbnail: videoUpload?.assets?.thumbnail,
      userId: id,
    },
  });
  return video;
};

export const videoUpdate = async (videoUpload: any, url: string) => {
  const video = await prisma.videos.update({
    where: {
      id: url,
    },
    data: {
      name: videoUpload?.title,
      videoUrl: videoUpload?.assets?.mp4,
      thumbnail: videoUpload?.assets?.thumbnail,
    },
  });
  return video;
};
