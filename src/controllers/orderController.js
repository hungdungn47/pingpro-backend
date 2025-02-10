const orderService = require("../services/orderService");
const ApiError = require("../utils/apiError");
const StatusCodes = require("http-status-codes");

const placeOrder = async (req, res, next) => {
  try {
    const {
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
    } = req.body;
    if (
      !fullName ||
      !address ||
      !city ||
      !country ||
      !phone ||
      !paymentMethod ||
      !itemsPrice ||
      !shippingPrice ||
      !taxPrice ||
      !totalPrice ||
      !userId
    ) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing required field!");
    }

    const response = await orderService.placeOrder(req.body);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  placeOrder,
};
