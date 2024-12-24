const userService = require("../services/userService");
const jwtService = require("../services/jwtService");
const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/apiError");

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;
    if (!email || !password || !confirmPassword) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "Missing required field"
      );
    }
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const isEmail = reg.test(email);
    if (!isEmail) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "Email is in wrong format"
      );
    }
    if (password !== confirmPassword) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Password and confirm password do not match"
      );
    }

    const response = await userService.createUser(req.body);

    return res.status(StatusCodes.CREATED).json(response);
  } catch (e) {
    next(e);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "Missing required field"
      );
    }
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const isEmail = reg.test(email);
    if (!isEmail) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "Email is in wrong format"
      );
    }
    const response = await userService.loginUser(req.body);
    const { refresh_token, ...newResponse } = response;
    res.cookie("refresh_token", refresh_token, {
      HttpOnly: true,
      Secure: true,
    });
    return res.status(StatusCodes.OK).json(newResponse);
  } catch (e) {
    next(e);
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
    return res.status(StatusCodes.OK).json(response);
  } catch (e) {
    next(e);
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
    return res.status(StatusCodes.OK).json(response);
  } catch (e) {
    next(e);
  }
};

const getAllUser = async (req, res, next) => {
  try {
    const response = await userService.getAllUser();
    return res.status(StatusCodes.OK).json(response);
  } catch (e) {
    next(e);
  }
};

const getUserDetails = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const response = await userService.getUserDetails(userId);
    return res.status(StatusCodes.OK).json(response);
  } catch (e) {
    next(e);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refresh_token;
    if (!token) {
      throw new Error("Token missing");
    }
    const response = await jwtService.refreshTokenService(token);
    return res.status(StatusCodes.OK).json(response);
  } catch (e) {
    console.log(e.message);
    const customError = new ApiError(
      StatusCodes.UNAUTHORIZED,
      new Error(e).message
    );
    next(customError);
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
