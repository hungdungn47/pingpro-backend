const express = require("express");
const orderController = require("../controllers/orderController");
const {
  authUserMiddleware,
  authAdminMiddleware,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/place", authUserMiddleware, orderController.placeOrder);
router.post("/verify", authUserMiddleware, orderController.verifyOrder);
router.post(
  "/update-status",
  authAdminMiddleware,
  orderController.updateStatus
);
router.get("/get-all", authAdminMiddleware, orderController.getAllOrders);

module.exports = router;
