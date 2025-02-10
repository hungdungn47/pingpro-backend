const Order = require("../models/orderProduct");
const Product = require("../models/productModel");

const placeOrder = async (orderData) => {
  const {
    orderItems,
    fullName,
    address,
    city,
    country,
    phone,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    userId,
  } = orderData;

  // Check if all products exist and have enough stock
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new Error(`Product not found: ${item.name}`);
    }
    if (product.countInStock < item.amount) {
      throw new Error(`Not enough stock for product: ${item.name}`);
    }
  }

  // Reduce stock for each product
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { countInStock: -item.amount },
    });
  }

  // Create the order
  const createdOrder = await Order.create({
    orderItems,
    shippingAddress: {
      fullName,
      address,
      city,
      country,
      phone,
    },
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    user: userId,
  });

  return {
    message: "Order placed successfully",
    data: createdOrder,
  };
};

module.exports = {
  placeOrder,
};
