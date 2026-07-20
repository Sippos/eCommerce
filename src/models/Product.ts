import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
{
  timestamps: true,
  toJSON: {
    transform: (_document, returnedObject) => {
      const { _id, __v, ...publicProduct } = returnedObject;

      return {
        id: _id.toString(),
        ...publicProduct,
      };
    },
  },
})

export const Product = mongoose.model(
  "Product",
  productSchema
);