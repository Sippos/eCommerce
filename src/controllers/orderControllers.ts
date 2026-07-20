import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  Order,
  Product,
  User,
} from "../models/index.ts";

import type {
  CreateOrderBody,
  UpdateOrderBody,
} from "../schemas/orderSchemas.ts";

type OrderProductInput = {
  productId: string;
  quantity: number;
};

type OrderCalculationResult =
  | {
      success: true;
      total: number;
    }
  | {
      success: false;
      status: number;
      error: string;
      missingProductIds?: string[];
    };


async function validateOrderAndCalculateTotal(
  userId: string,
  products: OrderProductInput[],
): Promise<OrderCalculationResult> {
  const userExists = await User.exists({
    _id: userId,
  });

  if (!userExists) {
    return {
      success: false,
      status: 404,
      error: "User not found",
    };
  }

  const productIds = [
    ...new Set(
      products.map((item) => item.productId),
    ),
  ];

  const existingProducts = await Product.find({
    _id: {
      $in: productIds,
    },
  })
    .select("_id price")
    .lean();

  const priceByProductId = new Map(
    existingProducts.map((product) => [
      product._id.toString(),
      product.price,
    ]),
  );

  const missingProductIds = productIds.filter(
    (productId) =>
      !priceByProductId.has(productId),
  );

  if (missingProductIds.length > 0) {
    return {
      success: false,
      status: 404,
      error: "One or more products were not found",
      missingProductIds,
    };
  }

 
  const totalInCents = products.reduce(
    (sum, item) => {
      const price =
        priceByProductId.get(item.productId);

      if (price === undefined) {
        return sum;
      }

      const priceInCents = Math.round(
        price * 100,
      );

      return (
        sum +
        priceInCents * item.quantity
      );
    },
    0,
  );

  return {
    success: true,
    total: totalInCents / 100,
  };
}


export async function getOrders(
  _request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    response.status(200).json(orders);
  } catch (error) {
    next(error);
  }
}


export async function getOrderById(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = request.params;

    const order = await Order.findById(id);

    if (!order) {
      response.status(404).json({
        error: "Order not found",
      });
      return;
    }

    response.status(200).json(order);
  } catch (error) {
    next(error);
  }
}


export async function createOrder(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const {
      userId,
      products,
    }: CreateOrderBody = request.body;

    const calculation =
      await validateOrderAndCalculateTotal(
        userId,
        products,
      );

    if (!calculation.success) {
      response
        .status(calculation.status)
        .json({
          error: calculation.error,
          ...(calculation.missingProductIds && {
            missingProductIds:
              calculation.missingProductIds,
          }),
        });

      return;
    }

    const order = await Order.create({
      userId,
      products,
      total: calculation.total,
    });

    response.status(201).json(order);
  } catch (error) {
    next(error);
  }
}


export async function updateOrder(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = request.params;

    const updates: UpdateOrderBody =
      request.body;

    const order = await Order.findById(id);

    if (!order) {
      response.status(404).json({
        error: "Order not found",
      });
      return;
    }

    const nextUserId =
      updates.userId ??
      order.userId!.toString();

    const nextProducts: OrderProductInput[] =
      updates.products ??
      order.products.map((item) => ({
        productId:
          item.productId.toString(),
        quantity: item.quantity,
      }));


    const calculation =
      await validateOrderAndCalculateTotal(
        nextUserId,
        nextProducts,
      );

    if (!calculation.success) {
      response
        .status(calculation.status)
        .json({
          error: calculation.error,
          ...(calculation.missingProductIds && {
            missingProductIds:
              calculation.missingProductIds,
          }),
        });

      return;
    }

    order.set({
      userId: nextUserId,
      products: nextProducts,
      total: calculation.total,
    });

    await order.save();

    response.status(200).json(order);
  } catch (error) {
    next(error);
  }
}

export async function deleteOrder(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = request.params;

    const deletedOrder =
      await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      response.status(404).json({
        error: "Order not found",
      });
      return;
    }

    response.status(204).send();
  } catch (error) {
    next(error);
  }
}