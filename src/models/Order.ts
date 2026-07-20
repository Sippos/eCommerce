import mongoose from "mongoose";

const orderProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
  },
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: {
      type: [orderProductSchema],
      required: true,
      validate: {
        validator: (products: unknown[]) =>
          products.length > 0,
        message: "An order must contain at least one product",
      },
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_document, returnedObject) => {
        const { _id, __v, ...order } = returnedObject;

        return {
          id: _id.toString(),
          ...order,
        };
      },
    },
  },
);

export const Order = mongoose.model(
  "Order",
  orderSchema,
);