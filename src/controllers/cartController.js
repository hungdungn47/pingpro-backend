const { StatusCodes } = require("http-status-codes");
const cartService = require("../services/cartService");

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please include product ID in request body!",
      });
    }
    const result = await cartService.addToCart(
      req.body.userId,
      productId,
      quantity
    );
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please include product ID in request body!",
      });
    }
    const result = await cartService.removeFromCart(req.body.userId, productId);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const updateCartItemAmount = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please include product ID and quantity in request body!",
      });
    }
    const result = await cartService.updateCartItemAmount(
      req.body.userId,
      productId,
      quantity
    );
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const clearCart = async (req, res, next) => {
  try {
    const result = await cartService.clearCart(req.body.userId);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const getCart = async (req, res, next) => {
  try {
    const result = await cartService.getCart(req.headers.userId);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  updateCartItemAmount,
  clearCart,
  getCart,
};
