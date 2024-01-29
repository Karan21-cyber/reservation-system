import { Request, Response, NextFunction } from "express";
import { type AnyZodObject } from "zod";

const validationMiddleware = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (error: unknown) {
      console.log(error);
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };
};

export default validationMiddleware;
