import type { NextFunction, Request, Response } from "express"
import { Category } from "../models/index.ts"

export async function getCategories(
  _request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const categories = await Category.find();

    response.status(200).json(categories);
  } catch (error) {
    next(error);
  }
}

export async function getCategoryById(
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const { id } = request.params

        const category = await Category.findById(id)

        if(!category) {
            response.status(404).json({
                error: "Category not found",
            })
            return
        }

        response.status(200).json(category)
    } catch (error) {
        next(error)
    }
}

export async function createCategory(
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const { name } = request.body

        const category = await Category.create({ name })

        response.status(201).json(category)
    } catch (error) {
        next(error)
    }
}

export async function updateCategory(
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const { id } = request.params
        const { name } = request.body

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name },
            {
                new: true,
                runValidators: true,
            }
        )

        if(!updatedCategory) {
            response.status(404).json({
                error: "Category not found"
            })
            return
        }
        
        response.status(200).json(updatedCategory)
    } catch (error) {
        next(error)
    }
}

export async function deleteCategory(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = request.params;

    const deletedCategory = await Category.findByIdAndDelete(id)

    if(!deletedCategory) {
        response.status(400).json({
            error: "Category not found"
        })
        return
    }
    response.status(200).json({
      message: "Category deleted",
    });
  } catch (error) {
    next(error);
  }
}