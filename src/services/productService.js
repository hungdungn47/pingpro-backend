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

// const getAllProducts = async (
//   limit,
//   page,
//   sortBy,
//   sortOrder,
//   minPrice,
//   maxPrice,
//   searchBy,
//   searchValue,
//   brand,
//   category
// ) => {
//   try {
//     const totalProduct = await Product.countDocuments();
//     let productList = [];
//     if (sortBy) {
//       productList = await Product.find({})
//         .limit(limit)
//         .skip((page - 1) * limit)
//         .sort({ [sortBy]: sortOrder || "asc" });
//     } else {
//       productList = await Product.find({})
//         .limit(limit)
//         .skip((page - 1) * limit);
//     }
//     if (maxPrice) {
//       if (!minPrice) minPrice = 0;
//       productList = productList.filter(
//         (item) =>
//           Number(item.price) >= minPrice && Number(item.price) <= maxPrice
//       );
//     }
//     if (searchBy && searchValue)
//       productList = productList.filter((item) =>
//         item[searchBy].toLowerCase().includes(searchValue.toLowerCase())
//       );
//     return {
//       message: "Get all products successfully",
//       data: productList,
//       total: totalProduct,
//       currentPage: page,
//       totalPages: Math.ceil(totalProduct / page),
//     };
//   } catch (error) {
//     throw error;
//   }
// };

const getAllProducts = async (
  limit = 10,
  page = 1,
  sortBy = null,
  sortOrder = "asc",
  minPrice = null,
  maxPrice = null,
  searchBy = null,
  searchValue = null,
  brand = null,
  category = null
) => {
  try {
    // Build filter object for MongoDB query
    const filter = {};

    // Price filter
    if (minPrice !== null || maxPrice !== null) {
      const priceFilter = {};

      if (minPrice !== null && !isNaN(Number(minPrice))) {
        priceFilter.$gte = Number(minPrice);
      }
      if (maxPrice !== null && !isNaN(Number(maxPrice))) {
        priceFilter.$lte = Number(maxPrice);
      }

      // Only set filter.price if priceFilter has properties
      if (Object.keys(priceFilter).length > 0) {
        filter.price = priceFilter;
      }
    }

    // Search filter (text search)
    if (searchBy && searchValue) {
      filter[searchBy] = { $regex: searchValue, $options: 'i' }; // Case-insensitive search
    }

    // Brand filter
    if (brand) {
      if (Array.isArray(brand)) {
        filter.brand = { $in: brand };
      } else {
        filter.brand = brand;
      }
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Build sort object
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    // Get total count with the same filters
    const totalProduct = await Product.countDocuments(filter);

    console.log('filter: ', filter)

    // Execute query with pagination, filtering and sorting
    const productList = await Product.find(filter)
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    // Return formatted response
    return {
      message: "Get all products successfully",
      data: productList,
      total: totalProduct,
      currentPage: page,
      totalPages: Math.ceil(totalProduct / limit), // Fixed: using limit instead of page
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
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(StatusCodes.NOT_FOUND, "This product does not exist");
  }
  const deletedProduct = await Product.findByIdAndDelete(productId);
  return deletedProduct;
};

const deleteMultipleProducts = async (idList) => {
  await Product.deleteMany({ _id: idList });
  return {
    message: "Deleted product list successfully",
  };
};

const getAllType = async () => {
  const typeList = await Product.distinct("category");
  return typeList;
};

const getBrands = async (category) => {
  const brandList = await Product.distinct("brand", { category })
  return brandList
}

module.exports = {
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
  deleteMultipleProducts,
  getAllType,
  getBrands
};
