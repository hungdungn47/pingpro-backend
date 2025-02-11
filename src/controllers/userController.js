const userService = require("../services/userService");
const jwtService = require("../services/jwtService");
const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/apiError");

// Email validation regex
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;

    if (!email || !password || !confirmPassword) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "Missing required fields"
      );
    }
    if (!EMAIL_REGEX.test(email)) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "Invalid email format"
      );
    }
    if (password !== confirmPassword) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Passwords do not match");
    }

    const response = await userService.createUser(req.body);
    res.status(StatusCodes.CREATED).json(response);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "Missing required fields"
      );
    }
    if (!EMAIL_REGEX.test(email)) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "Invalid email format"
      );
    }

    const response = await userService.loginUser(req.body);
    res.cookie("refresh_token", response.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
    });

    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    if (!userId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing user ID");
    }

    const response = await userService.updateUser(userId, req.body);
    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    if (!userId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing user ID");
    }

    const response = await userService.deleteUser(userId);
    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const response = await userService.getAllUsers();
    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const getUserDetails = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    if (!userId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing user ID");
    }

    const response = await userService.getUserDetails(userId);
    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.headers.authorization.split(" ")[1];
    if (!refreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token missing");
    }

    const response = await jwtService.refreshTokenService(refreshToken);
    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, error.message));
  }
};

const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("refresh_token");
    res.status(StatusCodes.OK).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserDetails,
  refreshToken,
  logoutUser,
};
