const express = require("express");
const orderController = require("../controllers/orderController");
const { authUserMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/place", authUserMiddleware, orderController.placeOrder);

module.exports = router;
