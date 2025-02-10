const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const { StatusCodes } = require("http-status-codes");
const dotenv = require("dotenv").config();

const authAdminMiddleware = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Missing token!");
    }
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "This token is not valid");
      }
      const { payload } = user;
      if (payload?.isAdmin) {
        next();
      } else {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "You do not have authorization for this action"
        );
      }
    });
  } catch (error) {
    next(error);
  }
};

const authUserMiddleware = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const userId = req.params.id;
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const { payload } = user;
    if (payload?.isAdmin || payload?.id === userId) {
      req.body.userId = payload?.id;
      next();
    } else {
      return res.status(401).json({
        message: "You do not have authorization for this action",
      });
    }
  });
};

module.exports = {
  authAdminMiddleware,
  authUserMiddleware,
};
