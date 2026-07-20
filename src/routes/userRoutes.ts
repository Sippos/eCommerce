import { Router } from "express"

import {
    createUser,
    deleteUser,
    getUserById,
    getUsers,
    updateUser,
 } from  "../controllers/userControllers.ts"

import { validateBody, validateParams } from "../middleware/validate.ts"
import {
    createUserBodySchema,
    updateUserBodySchema,
    userIdParamsSchema, 
} from "../schemas/userSchema.ts"

const router = Router()

router.get("/", getUsers)

router.get("/:id",
    validateParams(userIdParamsSchema),
    getUserById,
)

router.post(
    "/",
    validateBody(createUserBodySchema),
    createUser,
)

router.put(
    "/:id",
    validateParams(userIdParamsSchema),
    validateBody(updateUserBodySchema),
    updateUser,
)

router.delete(
    "/:id",
    validateParams(userIdParamsSchema),
    deleteUser,
)

export default router