const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const createAccessToken = (payload) => {
  const access_token = jwt.sign(
    {
      payload,
    },
    process.env.JWT_SECRET,
    { expiresIn: "10m" }
  );
  return access_token;
};

const createRefreshToken = (payload) => {
  const refresh_token = jwt.sign(
    {
      payload,
    },
    process.env.JWT_SECRET,
    { expiresIn: "3d" }
  );
  return refresh_token;
};

const refreshTokenService = async (token) => {
  try {
    const access_token = jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err, user) => {
        if (err) {
          throw err;
        }
        const { payload } = user;
        console.log("Payload of decoded refresh token: ", payload);
        const access_token = createAccessToken({
          id: payload?.id,
          isAdmin: payload?.isAdmin,
        });
        return access_token;
      }
    );
    return {
      message: "Refresh token successfully",
      access_token,
    };
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  refreshTokenService,
};
