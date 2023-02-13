import mongoose from "mongoose";

const ProductSchema = mongoose.Schema(
  {
    itemCode: { type: String },
    title: { type: String },
    brand: {
      type: String,
    },
    category: { type: String },
    image: { type: String },
    primaryUnit: { type: String },
    secondaryUnit: { type: String },
    conversionRatio: { type: Number },
    price: {
      type: Number,
      default: 0,
    },
    purchasePrice: { type: Number, default: 0 },
    quantity: {
      type: Number,
      default: 0,
    },
    lowQuantityAlert: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    remarks: { type: String },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
