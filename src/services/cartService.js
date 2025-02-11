const { StatusCodes } = require("http-status-codes");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const ApiError = require("../utils/apiError");

const addToCart = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, items: [], totalPrice: 0 });
  }

  const itemIndex = cart.items.findIndex((item) =>
    item.product.equals(productId)
  );

  if (itemIndex > -1) {
    // If product exists, update quantity
    cart.items[itemIndex].quantity += quantity;
  } else {
    // Add new product to cart
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
    });
  }

  // Recalculate total price
  cart.totalPrice = cart.items.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  await cart.save();
  return {
    message: "Added item to cart",
    cart,
  };
};

const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(StatusCodes.NOT_FOUND, "Your cart is empty!");

  cart.items = cart.items.filter((item) => !item.product.equals(productId));

  // Recalculate total price
  cart.totalPrice = cart.items.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  await cart.save();
  return { message: "Item removed", cart };
};

const updateCartItemAmount = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(StatusCodes.NOT_FOUND, "Your cart is empty!");

  const itemIndex = cart.items.findIndex((item) =>
    item.product.equals(productId)
  );
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity = quantity;
  } else {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "This product is not in your cart!"
    );
  }
  cart.totalPrice = cart.items.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );
  return { message: "Updated cart successfully!", cart };
};

const clearCart = async (userId) => {
  const cart = await Cart.findOneAndDelete({ user: userId }, { new: true });
  return { message: "Cleared cart successfully!", cart };
};

const getCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  return { message: "Get cart successfully!", cart };
};

module.exports = {
  addToCart,
  removeFromCart,
  updateCartItemAmount,
  clearCart,
  getCart,
};
