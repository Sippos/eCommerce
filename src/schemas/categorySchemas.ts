import mongoose from "mongoose"
import { z } from "zod"

export const categoryBodySchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Category name is required")
})

export const categoryIdParamsSchema = z.object({
    id: z.string().refine(
        (value) => mongoose.Types.ObjectId.isValid(value), "Invalid category by ID"
    )
})

export type CategoryBody = z.infer<typeof categoryBodySchema>