const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    images: [{ type: String, required: true }],
    price: { type: Number, required: true },
    rating: { type: Number, required: false },
    stockQuantity: { type: Number, required: true },
    soldQuantity: { type: Number, default: 0 },
    description: { type: String, required: true },
    details: [{
      name: { type: String, required: true },
      value: { type: String, required: true }
    }],
    reviewCount: { type: Number, default: 0 }
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;
