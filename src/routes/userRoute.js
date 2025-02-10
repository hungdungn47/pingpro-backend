const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  authAdminMiddleware,
  authUserMiddleware,
} = require("../middlewares/authMiddleware");

router.post("/sign-up", userController.createUser);
router.post("/sign-in", userController.loginUser);
router.post("/log-out", userController.logoutUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", authAdminMiddleware, userController.deleteUser);
router.get("/", authAdminMiddleware, userController.getAllUser);
router.get("/refresh-token", userController.refreshToken);
router.get("/:id", authUserMiddleware, userController.getUserDetails);

module.exports = router;
