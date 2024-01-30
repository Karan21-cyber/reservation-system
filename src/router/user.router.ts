import { Router } from "express";
import userController from "../controller/user.controller";
import upload from "../service/upload.file";
import validationMiddleware from "../middleware/validation.middleware";
import { createUserSchema, updateUserSchema } from "../schema/user.schema";

const router = Router();

router.post(
  "/v1/user",
  validationMiddleware(createUserSchema),
  userController.createUser
);
router.get("/v1/user/:id", userController.getUserById);
router.get("/v1/user", userController.getAllUser);
router.put(
  "/v1/user/:id",
  validationMiddleware(updateUserSchema),
  userController.uploadImage
);

router.put(
  "/v1/user/image/:id",
  upload.single("image"),
  userController.uploadImage
);

router.post("/v1/sendmail", userController.sendMail);

const userRouter = router;

export default userRouter;
