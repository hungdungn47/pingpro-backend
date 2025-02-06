const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router
  .route("/")
  .post(authMiddleware, productController.createProduct)
  .get(productController.getAllProducts);
router
  .route("/:id")
  .get(productController.getProductById)
  .put(authMiddleware, productController.updateProduct)
  .delete(authMiddleware, productController.deleteProduct);
router
  .route("/delete-multiple")
  .post(authMiddleware, productController.deleteMultipleProducts);

module.exports = router;
