import { Router } from "express";

import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  updateOrder,
} from "../controllers/orderControllers.ts";

import {
  createOrderBodySchema,
  orderIdParamsSchema,
  updateOrderBodySchema,
} from "../schemas/orderSchemas.ts";

import {
  validateBody,
  validateParams,
} from "../middleware/validate.ts";

const router = Router();

router.get(
  "/",
  getOrders,
);

router.post(
  "/",
  validateBody(createOrderBodySchema),
  createOrder,
);

router.get(
  "/:id",
  validateParams(orderIdParamsSchema),
  getOrderById,
);

router.put(
  "/:id",
  validateParams(orderIdParamsSchema),
  validateBody(updateOrderBodySchema),
  updateOrder,
);

router.delete(
  "/:id",
  validateParams(orderIdParamsSchema),
  deleteOrder,
);

export default router;