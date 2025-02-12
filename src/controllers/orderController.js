const orderService = require("../services/orderService");
const ApiError = require("../utils/apiError");
const StatusCodes = require("http-status-codes");

const placeOrder = async (req, res, next) => {
  try {
    const { fullName, address, city, country, phone, paymentMethod, userId } =
      req.body;
    if (
      !fullName ||
      !address ||
      !city ||
      !country ||
      !phone ||
      !paymentMethod ||
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

const verifyOrder = async (req, res, next) => {
  try {
    const { orderId, success } = req.body;
    const result = await orderService.verifyOrder(orderId, success);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { orderId, status } = req.body;
    const result = await orderService.updateStatus(orderId, status);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const result = await orderService.getAllOrders();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  placeOrder,
  verifyOrder,
  updateStatus,
  getAllOrders,
};
