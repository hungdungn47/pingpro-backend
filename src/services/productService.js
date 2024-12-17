const { StatusCodes } = require("http-status-codes");
const Product = require("../models/productModel");
const ApiError = require("../utils/apiError");

const createProduct = async (productData) => {
  try {
    const checkProduct = await Product.findOne({
      name: productData.name,
    });
    if (checkProduct) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "This product already existed"
      );
    }
    const createdProduct = await Product.create(productData);
    return createdProduct;
  } catch (error) {
    throw error;
  }
};

const getProductById = async (productId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, "This product does not exist");
    }
    return product;
  } catch (error) {
    throw error;
  }
};

const getAllProducts = async (
  limit,
  page,
  sortBy,
  sortOrder,
  minPrice,
  maxPrice,
  searchBy,
  searchValue
) => {
  try {
    const totalProduct = await Product.countDocuments();
    let productList = [];
    if (sortBy) {
      productList = await Product.find({})
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ [sortBy]: sortOrder || "asc" });
    } else {
      productList = await Product.find({})
        .limit(limit)
        .skip((page - 1) * limit);
    }
    if (maxPrice) {
      if (!minPrice) minPrice = 0;
      productList = productList.filter(
        (item) =>
          Number(item.price) >= minPrice && Number(item.price) <= maxPrice
      );
    }
    if (searchBy && searchValue)
      productList = productList.filter((item) =>
        item[searchBy].toLowerCase().includes(searchValue.toLowerCase())
      );
    return {
      message: "Get all products successfully",
      data: productList,
      total: totalProduct,
      currentPage: page,
      totalPages: Math.ceil(totalProduct / page),
    };
  } catch (error) {
    throw error;
  }
};

const updateProduct = async (productId, newProductData) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, "This product does not exist");
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      newProductData,
      { new: true }
    );
    return updatedProduct;
  } catch (error) {
    throw error;
  }
};

const deleteProduct = async (productId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, "This product does not exist");
    }
    const deletedProduct = await Product.findByIdAndDelete(productId);
    return deletedProduct;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
