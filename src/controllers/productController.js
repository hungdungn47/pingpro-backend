const { StatusCodes } = require("http-status-codes");
const productService = require("../services/productService");
const ApiError = require("../utils/apiError");

const createProduct = async (req, res, next) => {
  try {
    const result = await productService.createProduct(req.body);
    return res.status(StatusCodes.CREATED).json({
      message: "Created product successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing product id");
    }
    const result = await productService.getProductById(productId);
    return res.status(StatusCodes.OK).json({
      message: "Get product successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const {
      limit,
      page,
      sortBy,
      sortOrder,
      minPrice,
      maxPrice,
      searchBy,
      searchValue,
    } = req.query;
    const result = await productService.getAllProducts(
      Number(limit),
      Number(page),
      sortBy,
      sortOrder,
      Number(minPrice),
      Number(maxPrice),
      searchBy,
      searchValue
    );
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const productData = req.body;
    if (!productId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing product id");
    }
    const result = await productService.updateProduct(productId, productData);
    return res.status(StatusCodes.OK).json({
      message: "Updated product successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing product id");
    }
    const result = await productService.deleteProduct(productId);
    return res.status(StatusCodes.OK).json({
      message: "Deleted product successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
