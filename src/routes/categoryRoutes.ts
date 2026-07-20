import { Router } from "express";

import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/categoryControllers.ts";

import {
  categoryBodySchema,
  categoryIdParamsSchema,
} from "../schemas/categorySchemas.ts";

import {
  validateBody,
  validateParams,
} from "../middleware/validate.ts";

const router = Router();

router.get("/", getCategories);

router.post(
  "/",
  validateBody(categoryBodySchema),
  createCategory,
);

router.get(
  "/:id",
  validateParams(categoryIdParamsSchema),
  getCategoryById,
);

router.put(
  "/:id",
  validateParams(categoryIdParamsSchema),
  validateBody(categoryBodySchema),
  updateCategory,
);

router.delete(
  "/:id",
  validateParams(categoryIdParamsSchema),
  deleteCategory,
);

export default router;