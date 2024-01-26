/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import prisma from "./prisma";
import errorMiddleware from "./middleware/error.middleware";
import userRouter from "./router/user.router";
import authRouter from "./router/auth.router";
import videoRouter from "./router/video.router";
import imageRouter from "./router/image.router";

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
  return res.status(200).json({
    success: true,
    code: 200,
    message: "Welcome to reservation-system. Server is running...",
  });
});

app.use(userRouter, authRouter, videoRouter, imageRouter);

app.use(errorMiddleware);

prisma
  .$connect()
  .then(() => {
    const PORT = 3800;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((e: any) => {
    console.log("Error: ", e);
  });
