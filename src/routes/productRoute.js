const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { authAdminMiddleware } = require("../middlewares/authMiddleware.js");

router
  .route("/")
  .post(authAdminMiddleware, productController.createProduct)
  .get(productController.getAllProducts);
router.get("/all-type", productController.getAllType);
router
  .route("/:id")
  .get(productController.getProductById)
  .put(authAdminMiddleware, productController.updateProduct)
  .delete(authAdminMiddleware, productController.deleteProduct);
router
  .route("/delete-multiple")
  .post(authAdminMiddleware, productController.deleteMultipleProducts);

module.exports = router;
