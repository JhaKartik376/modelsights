import type { Request, Response, NextFunction } from "express";
import type { z } from "zod";

export function validate<T extends z.ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: "Validation failed",
        details: result.error.issues,
      });
      return;
    }
    req.body = result.data;
    next();
  };
}
