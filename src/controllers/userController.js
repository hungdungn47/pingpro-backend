const userService = require("../services/userService");
const jwtService = require("../services/jwtService");

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;
    if (!name || !email || !password || !confirmPassword || !phone) {
      return res.status(400).json({
        message: "Missing required field",
      });
    }
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const isEmail = reg.test(email);
    if (!isEmail) {
      return res.status(400).json({
        message: "Email is in wrong format",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password and confirm password do not match",
      });
    }

    const response = await userService.createUser(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Missing required field",
      });
    }
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const isEmail = reg.test(email);
    if (!isEmail) {
      return res.status(400).json({
        message: "Email is in wrong format",
      });
    }
    const response = await userService.loginUser(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    });
  }
};
const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const data = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "Missing user id",
      });
    }

    const response = await userService.updateUser(userId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    });
  }
};
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        message: "Missing user id",
      });
    }

    const response = await userService.deleteUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const response = await userService.getAllUser();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    const response = await userService.getUserDetails(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      res.status(400).json({
        message: "Refresh token is required",
      });
    }
    const response = await jwtService.refreshTokenService(token);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getUserDetails,
  refreshToken,
};
