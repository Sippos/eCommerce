import { z } from "zod";

const mongoIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID");

const orderProductSchema = z.object({
  productId: mongoIdSchema,

  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
});

const orderFieldsSchema = z.object({
  userId: mongoIdSchema,

  products: z
    .array(orderProductSchema)
    .min(1, "An order must contain at least one product"),
});

export const createOrderBodySchema =
  orderFieldsSchema;

export const updateOrderBodySchema =
  orderFieldsSchema
    .partial()
    .refine(
      (body) => Object.keys(body).length > 0,
      {
        message: "Provide at least one field to update",
      },
    );

export const orderIdParamsSchema = z.object({
  id: mongoIdSchema,
});

export type CreateOrderBody = z.infer<
  typeof createOrderBodySchema
>;

export type UpdateOrderBody = z.infer<
  typeof updateOrderBodySchema
>;