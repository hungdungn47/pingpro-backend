const Order = require("../models/orderProduct");
const Product = require("../models/productModel");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (orderData) => {
  const frontendUrl = "http://localhost:5173";
  const {
    orderItems,
    fullName,
    address,
    city,
    country,
    phone,
    paymentMethod,
    userId,
  } = orderData;

  // Check if all products exist and have enough stock
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new Error(`Product not found: ${item.product}`);
    }
    console.log("In stock: ", product);
    console.log("quantity: ", item.quantity);
    if (product.countInStock < item.quantity) {
      throw new Error(`Not enough stock for product: ${product.name}`);
    }
  }
  console.log("hehe");

  const itemsData = await Promise.all(
    orderItems.map(async (item) => {
      const data = await Product.findById(item.product);
      return {
        ...data.toObject(), // Convert Mongoose document to plain object
        quantity: item.quantity,
        itemTotal: data.price * item.quantity, // Calculate total price for the item
      };
    })
  );

  // Calculate total items price
  const itemsPrice = itemsData.reduce(
    (total, item) => total + item.itemTotal,
    0
  );

  const shippingPrice = 20000;
  const totalPrice = itemsPrice + shippingPrice;

  // Reduce stock for each product
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { countInStock: -item.quantity },
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
    totalPrice,
    user: userId,
  });

  if (paymentMethod === "stripe") {
    const line_items = itemsData.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: (item.price * 100) / 25000,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: (shippingPrice * 100) / 25000,
      },
      quantity: 1,
    });
    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontendUrl}/verify?success=true&orderId=${createdOrder._id}`,
      cancel_url: `${frontendUrl}/verify?success=false&orderId=${createdOrder._id}`,
    });
    return {
      message: "Order placed successfully",
      data: createdOrder,
      session_url: session.url,
    };
  } else {
    return {
      message: "Order placed successfully",
      data: createdOrder,
    };
  }
};

const verifyOrder = async (orderId, success) => {
  if (success === "true") {
    await Order.findByIdAndUpdate(orderId, { status: "processing" });
    return {
      message: "Payment done successfully!",
    };
  } else {
    await Order.findByIdAndDelete(orderId);
    return {
      message: "Order cancelled!",
    };
  }
};

module.exports = {
  placeOrder,
  verifyOrder,
};
