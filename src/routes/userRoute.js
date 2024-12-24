const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  authMiddleware,
  authUserMiddleware,
} = require("../middlewares/authMiddleware");

router.post("/sign-up", userController.createUser);
router.post("/sign-in", userController.loginUser);
router.post("/log-out", userController.logoutUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", authMiddleware, userController.deleteUser);
router.get("/", authMiddleware, userController.getAllUser);
router.get("/refresh-token", userController.refreshToken);
router.get("/:id", authUserMiddleware, userController.getUserDetails);

module.exports = router;
