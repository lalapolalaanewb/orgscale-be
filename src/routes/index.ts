import express from "express";
import { implementations } from "../controllers/problem-4";
import {
  createContent,
  deleteContent,
  getContent,
  getContents,
  updateContent,
} from "../controllers/problem-5";
import {
  validateCreateContent,
  validateSlug,
  validateUpdateContent,
} from "../validations/problem-5";

const router = express.Router();

router.get("/prob-4/:num", implementations);
router.get("/prob-5", getContents);
router.get("/prob-5/:slug", validateSlug, getContent);
router.post("/prob-5/new", validateCreateContent, createContent);
router.patch(
  "/prob-5/:slug",
  validateSlug,
  validateUpdateContent,
  updateContent,
);
router.delete("/prob-5/:slug", validateSlug, deleteContent);

export default router;
