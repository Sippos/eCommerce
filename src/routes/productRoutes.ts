import { Router } from "express";

import { 
  createProduct,
  deleteProduct,
  getProductById, 
  getProducts,
  updateProduct,
 } from "../controllers/productControllers.ts";

import { 
  createProductBodySchema,
  productIdParamsSchema,
  productQuerySchema,
  updateProductBodySchema,
 } from "../schemas/productSchemas.ts";
 
import { 
  validateBody,
  validateParams,
  validateQuery } from "../middleware/validate.ts";

const router = Router();

router.get(
  "/",
  validateQuery(productQuerySchema),
  getProducts,
);

router.post(
  "/",
  validateBody(createProductBodySchema),
  createProduct,
);

router.get(
  "/:id",
  validateParams(productIdParamsSchema),
  getProductById,
);

router.put(
  "/:id",
  validateParams(productIdParamsSchema),
  validateBody(updateProductBodySchema),
  updateProduct,
);

router.delete(
  "/:id",
  validateParams(productIdParamsSchema),
  deleteProduct,
);

export default router;