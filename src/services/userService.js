const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const { generalAccessToken, generalRefreshToken } = require("./jwtService");

const createUser = (reqBody) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, confirmPassword, phone } = reqBody;

    try {
      const checkUser = await User.findOne({ email });
      if (checkUser !== null) {
        throw new Error("This email is already used");
      }
      const hashedPassword = bcrypt.hashSync(password, 10);

      let createdUser = await User.create({
        name,
        email,
        password: hashedPassword,
        confirmPassword: hashedPassword,
        phone,
      });
      createdUser = createdUser.toObject();
      if (createdUser) {
        delete createdUser.password;
        resolve({
          message: "Created user successfully",
          data: createdUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const loginUser = (reqBody) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = reqBody;

    try {
      const checkUser = await User.findOne({ email });
      if (!checkUser) {
        throw new Error("This email is not registered yet!");
      }
      const comparePassword = bcrypt.compareSync(password, checkUser.password);
      if (comparePassword) {
        const access_token = generalAccessToken({
          id: checkUser.id,
          isAdmin: checkUser.isAdmin,
        });

        const refresh_token = generalRefreshToken({
          id: checkUser.id,
          isAdmin: checkUser.isAdmin,
        });

        resolve({
          message: "Login successfully",
          access_token,
          refresh_token,
        });
      } else {
        throw new Error("Incorrect password");
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateUser = async (userId, data) => {
  try {
    const checkUser = await User.findOne({ _id: userId });
    if (!checkUser) {
      throw new Error("This user has not been registered");
    }

    delete data.password;

    let result = await User.findByIdAndUpdate(userId, data, { new: true });
    result = result.toObject();
    delete result["password"];
    return { message: "Updated user successfully", data: result };
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    const checkUser = await User.findOne({ _id: userId });
    if (!checkUser) {
      throw new Error("This user has not been registered");
    }
    await User.findByIdAndDelete(userId);
    return {
      message: "Deleted user successfully",
    };
  } catch (error) {
    throw error;
  }
};

const getAllUser = async () => {
  try {
    const result = await User.find();
    return {
      message: "Get all users successfully",
      data: result,
    };
  } catch (error) {
    throw error;
  }
};

const getUserDetails = async (userId) => {
  try {
    let result = await User.findById(userId);
    result = result.toObject();
    delete result.password;
    return {
      message: "Get user successfully",
      data: result,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getUserDetails,
};
