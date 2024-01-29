import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import prisma from "../prisma";

const createLocation = asyncHandler(async (req: Request, res: Response) => {
  const reqBody = req.body;

  const locationExist = await prisma.location.findFirst({
    where: {
      name: reqBody.name,
    },
  });

  if (locationExist) throw new Error("Location already exist.");

  const location = await prisma.location.create({
    data: reqBody,
  });

  return res.status(201).json({
    success: true,
    message: "Location created successfully.",
    data: location,
  });
});

const getLocations = asyncHandler(async (req: Request, res: Response) => {
  const locations = await prisma.location.findMany();
  return res.status(200).json({
    success: true,
    message: "Locations fetched successfully.",
    data: locations,
  });
});

const getSingleLocation = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const location = await prisma.location.findUnique({
    where: {
      id: id,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Location fetched successfully.",
    data: location,
  });
});

const updateLocation = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const reqBody = req.body;

  const location = await prisma.location.update({
    where: {
      id: id,
    },
    data: reqBody,
  });

  return res.status(200).json({
    success: true,
    message: "Location updated successfully.",
    data: location,
  });
});

const deleteLocation = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.location.delete({
    where: {
      id: id,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Location deleted successfully.",
  });
});

const locationController = {
  createLocation,
  updateLocation,
  getLocations,
  getSingleLocation,
  deleteLocation,
};

export default locationController;
