import { Router } from "express";
import imageController from "../controller/image.controller";
import upload from "../service/upload.file";

const router = Router();
router.put(
  "/v1/multipleimage/:id",
  upload.array("images"),
  imageController.multipleImage
);

router.get("/v1/multipleimage/:id", imageController.getMultipleImageById);
router.get("/v1/multipleimage", imageController.getAllImages);

const imageRouter = router;
export default imageRouter;
