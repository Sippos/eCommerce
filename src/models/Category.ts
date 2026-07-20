import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
{
  timestamps: true,
  toJSON: {
    transform: (_document, returnedObject) => {
      const { _id, __v, ...publicCategory } = returnedObject;

      return {
        id: _id.toString(),
        ...publicCategory,
      };
    },
  },
})

export const Category = mongoose.model("Category", categorySchema);