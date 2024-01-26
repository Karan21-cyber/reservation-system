import { Router } from "express";
import imageController from "../controller/image.controller";
import upload from "../service/upload.file";

const router = Router();
router.put(
  "/v1/user/multipleimage/:id",
  upload.array("images"),
  imageController.multipleImage
);

const imageRouter = router;
export default imageRouter;
