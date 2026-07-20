import { z } from "zod";

const mongoIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID");

const productFieldsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Product name is required")
    .max(100, "Product name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(1, "Product description is required")
    .max(1000, "Description cannot exceed 1000 characters"),

  price: z
    .number()
    .min(0, "Price cannot be negative"),

  categoryId: mongoIdSchema,
});

export const createProductBodySchema =
  productFieldsSchema;

export const updateProductBodySchema =
  productFieldsSchema
    .partial()
    .refine(
      (body) => Object.keys(body).length > 0,
      {
        message: "Provide at least one field to update",
      },
    );

export const productIdParamsSchema = z.object({
  id: mongoIdSchema,
});

export const productQuerySchema = z.object({
  categoryId: mongoIdSchema.optional(),
});

export type CreateProductBody = z.infer<
  typeof createProductBodySchema
>;

export type UpdateProductBody = z.infer<
  typeof updateProductBodySchema
>;