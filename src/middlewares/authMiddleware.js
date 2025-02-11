const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const { StatusCodes } = require("http-status-codes");
const dotenv = require("dotenv").config();

// const authAdminMiddleware = (req, res, next) => {
//   try {
//     if (!req.headers.authorization) {
//       throw new ApiError(StatusCodes.UNAUTHORIZED, "Missing token!");
//     }
//     const token = req.headers.authorization.split(" ")[1];
//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//       if (err) {
//         throw new ApiError(StatusCodes.UNAUTHORIZED, "This token is not valid");
//       }
//       const { payload } = user;
//       if (payload?.isAdmin) {
//         next();
//       } else {
//         throw new ApiError(
//           StatusCodes.UNAUTHORIZED,
//           "You do not have authorization for this action"
//         );
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const checkAdminMiddleware = (req, res, next) => {
  try {
    if (!req.body.isAdmin) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Only admins can do this action"
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

const authUserMiddleware = (req, res, next) => {
  try {
    if (!req.headers?.authorization) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Missing access token!");
    }
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "This token is not valid");
      }
      const { payload } = data;
      if (payload?.id) {
        req.body.userId = payload?.id;
        req.headers.userId = payload?.id;
        req.body.isAdmin = payload?.isAdmin;
        next();
      } else {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "This token is not valid");
      }
    });
  } catch (error) {
    next(error);
  }
};

const authAdminMiddleware = [authUserMiddleware, checkAdminMiddleware];

module.exports = {
  authAdminMiddleware,
  authUserMiddleware,
};
