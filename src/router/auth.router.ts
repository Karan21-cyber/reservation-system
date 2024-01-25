import { Router } from "express";
import authController from "../controller/auth.controller";

const router = Router();

router.post("/v1/login", authController.userLogin);

const authRouter = router;
export default authRouter;
