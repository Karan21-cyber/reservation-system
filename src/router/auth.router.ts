import { Router } from "express";
import authController from "../controller/auth.controller";

const router = Router();

router.post("/v1/login", authController.userLogin);
router.post("/v1/logout/:id", authController.userLogOut);
router.post("/v1/refresh", authController.refreshLogin);

const authRouter = router;
export default authRouter;
