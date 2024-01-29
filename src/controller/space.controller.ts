import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import prisma from "../prisma";

const createSlotPromises = (totalSlot: unknown, spaceId: string) => {
  if (!totalSlot) {
    return [];
  }

  return Array(totalSlot)
    .fill("")
    .map(async (_, index: number) => {
      try {
        await prisma.slots.create({
          data: {
            slotNo: index + 1,
            spaceId: spaceId,
          },
        });

        return {
          success: true,
          message: "Slot created successfully.",
        };
      } catch (error) {
        return {
          success: false,
          message: "Unable to create slot.",
        };
      }
    });
};

const createspace = asyncHandler(async (req: Request, res: Response) => {
  const reqBody = req.body;
  const totalSlot: number[] = reqBody.totalSlots;

  const spaceExist = await prisma.space.findFirst({
    where: {
      name: reqBody.name,
    },
  });

  if (spaceExist) throw new Error("space already exist.");

  const space = await prisma.space.create({
    data: reqBody,
  });

  //creating slots
  Promise.allSettled(createSlotPromises(totalSlot, space?.id));

  return res.status(201).json({
    success: true,
    message: "space created successfully.",
    data: space,
  });
});

const getspaces = asyncHandler(async (req: Request, res: Response) => {
  const spaces = await prisma.space.findMany();

  if (!spaces) throw new Error("No spaces found.");

  return res.status(200).json({
    success: true,
    message: "spaces fetched successfully.",
    data: spaces,
  });
});

const getSinglespace = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const space = await prisma.space.findUnique({
    where: {
      id: id,
    },
  });

  if (!space) throw new Error("space not found.");

  return res.status(200).json({
    success: true,
    message: "space fetched successfully.",
    data: space,
  });
});

const updatespace = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const reqBody = req.body;

  const space = await prisma.space.update({
    where: {
      id: id,
    },
    data: reqBody,
  });

  return res.status(200).json({
    success: true,
    message: "space updated successfully.",
    data: space,
  });
});

const deletespace = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.space.delete({
    where: {
      id: id,
    },
  });

  return res.status(200).json({
    success: true,
    message: "space deleted successfully.",
  });
});

const spaceController = {
  createspace,
  updatespace,
  getspaces,
  getSinglespace,
  deletespace,
};

export default spaceController;
