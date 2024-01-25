import { Router } from "express";
import asyncHandler from "../utils/asyncHandler";
import userController from "../controller/user.controller";
import upload from "../service/upload.file";

const router = Router();

router.post("/v1/user", asyncHandler(userController.createUser));
router.get("/v1/user/:id", asyncHandler(userController.getUserById));
router.put(
  "/v1/user/image/:id",
  upload.single("image"),
  asyncHandler(userController.uploadImage)
);

const userRouter = router;

export default userRouter;
