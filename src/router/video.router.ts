import { Router } from "express";
import videoController from "../controller/video.controller";
import upload from "../service/upload.file";

const router = Router();

router.put(
  "/v1/video/:id",
  upload.single("video"),
  videoController.uploadVideo
);
router.get("/v1/video/:id", videoController.getVideosById);

router.get("/v1/video", videoController.getAllVideos);

router.delete("/v1/video", videoController.deleteVideo);



const videoRouter = router;
export default videoRouter;
