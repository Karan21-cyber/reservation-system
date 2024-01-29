import { Request, Response } from "express";
import prisma from "../prisma";
import asyncHandler from "../utils/asyncHandler";
import HttpException from "../utils/HttpException";

const createbooked = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const reqBody = req.body;

  const slotExist = await prisma.booked.findFirst({
    where: {
      slotId: reqBody?.slotId as string,
    },
  });

  if (slotExist) throw new HttpException(409, "Slot already booked.");

  const booked = await prisma.booked.create({
    data: {
      ...reqBody,
      userId: id,
    },
  });

  return res.status(201).json({
    success: true,
    message: "Slot booked successfully.",
    data: booked,
  });
});

const getAllbooked = asyncHandler(async (req: Request, res: Response) => {
  const booked = await prisma.booked.findMany();
  return res.status(200).json({
    success: true,
    message: "Booked fetched successfully.",
    data: booked,
  });
});

const getBookedDataByUserId = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const booked = await prisma.booked.findMany({
      where: {
        userId: id,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Booked fetched successfully.",
      data: booked,
    });
  }
);


const getBookedDataBySlotId = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const booked = await prisma.booked.findMany({
      where: {
        slotId: id,
      },
      include: {
        slots: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Booked fetched successfully.",
      data: booked,
    });
  }
);

const bookedController = {
  createbooked,
  getAllbooked,
  getBookedDataByUserId,
  getBookedDataBySlotId,
};

export default bookedController;
