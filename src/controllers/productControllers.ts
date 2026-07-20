import type {
    NextFunction,
    Request,
    Response,
} from "express"

import { 
    Category,
    Product } from "../models/index.ts"

export async function getProducts(
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const { categoryId } = request.query

        const filter = categoryId
            ? { categoryId: String(categoryId) }
            : {}

        const products = await Product.find(filter)

        response.status(200).json(products)
    } catch (error) {
        next(error)
    }
}

export async function createProduct(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const {
      name,
      description,
      price,
      categoryId,
    } = request.body;

    const categoryExists = await Category.exists({
      _id: categoryId,
    });

    if (!categoryExists) {
      response.status(404).json({
        error: "Category not found",
      });
      return;
    }

    const product = await Product.create({
      name,
      description,
      price,
      categoryId,
    });

    response.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

export async function getProductById(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = request.params;

    const product = await Product.findById(id);

    if (!product) {
      response.status(404).json({
        error: "Product not found",
      });
      return;
    }

    response.status(200).json(product);
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = request.params;
    const updates = request.body;

    if (updates.categoryId) {
      const categoryExists = await Category.exists({
        _id: updates.categoryId,
      });

      if (!categoryExists) {
        response.status(404).json({
          error: "Category not found",
        });
        return;
      }
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!product) {
      response.status(404).json({
        error: "Product not found",
      });
      return;
    }

    response.status(200).json(product);
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = request.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      response.status(404).json({
        error: "Product not found",
      });
      return;
    }

    response.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}