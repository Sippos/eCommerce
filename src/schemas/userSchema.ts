import  mongoose  from 'mongoose'
import { z } from 'zod'

const mongoIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}/, "Invalid MongoDB ID")

const userFieldsSchema = z.object ({
        name: z 
            .string()
            .trim()
            .min(2, "Name must contain at least 2 characters")
            .max(100, "Name cannot exceed 100 Characters"),

        email: z
            .string()
            .trim()
            .lowercase()
            .email("Please provide a valid email adress"),

        password: z
            .string()
            .min(6, "Password must contain at least 6 characters"),
    })

export const createUserBodySchema = userFieldsSchema

export const updateUserBodySchema = userFieldsSchema
    .partial()
    .refine(
        (body) => Object.keys(body).length > 0,
        {
            message: "Provide at least one field to update"
        },
    )

export const userIdParamsSchema = z.object ({
    id: mongoIdSchema,
})