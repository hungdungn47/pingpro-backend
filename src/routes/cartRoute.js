const express = require("express");
const cartController = require("../controllers/cartController");
const { authUserMiddleware } = require("../middlewares/authMiddleware");

const cartRouter = express.Router();

cartRouter.post("/add-item", authUserMiddleware, cartController.addToCart);
cartRouter.post(
  "/remove-item",
  authUserMiddleware,
  cartController.removeFromCart
);
cartRouter.post(
  "/update-amount",
  authUserMiddleware,
  cartController.updateCartItemAmount
);
cartRouter.post("/clear", authUserMiddleware, cartController.clearCart);
cartRouter.get("/", authUserMiddleware, cartController.getCart);

module.exports = cartRouter;
