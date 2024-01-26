import { Router } from "express";
import userController from "../controller/user.controller";
import upload from "../service/upload.file";

const router = Router();

router.post("/v1/user", userController.createUser);
router.get("/v1/user/:id", userController.getUserById);
router.get("/v1/user", userController.getAllUser);

router.put(
  "/v1/user/image/:id",
  upload.single("image"),
  userController.uploadImage
);

const userRouter = router;

export default userRouter;
