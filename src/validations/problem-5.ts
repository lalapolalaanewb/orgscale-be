import { NextFunction, Request, Response } from "express";

export const validateSlug = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { slug } = req.params;

  if (!slug || Array.isArray(slug)) {
    res.status(400).json({ success: false, message: "Invalid param!" });
    return;
  }

  next();
};

export const validateCreateContent = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const body = req.body;

  if (
    !("alt" in body) ||
    !("description" in body) ||
    !("created_at" in body) ||
    typeof body.created_at !== "string" ||
    isNaN(new Date(body.created_at).getTime()) ||
    !body.created_by ||
    !body.title ||
    !("related" in body) ||
    !body.slug ||
    !body.status ||
    !("subDesc" in body) ||
    !("tags" in body) ||
    !("thumbnailUrl" in body)
  ) {
    res.status(400).json({
      success: false,
      message: "Invalid data!",
    });
  }

  next();
};

export const validateUpdateContent = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const body = req.body;

  if (!body.by) {
    res.status(400).json({
      success: false,
      message: "Invalid data!",
    });
  }

  next();
};
