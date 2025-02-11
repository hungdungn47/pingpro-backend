const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/apiError");
const { createAccessToken, createRefreshToken } = require("./jwtService");
const { StatusCodes } = require("http-status-codes");

// Create a new user
const createUser = async (reqBody) => {
  const { name, email, password, phone } = reqBody;

  if (await User.findOne({ email })) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "This email is already used");
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const createdUser = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
  });

  const { password: _, ...userWithoutPassword } = createdUser.toObject();

  return {
    message: "User created successfully",
    data: userWithoutPassword,
  };
};

// User login
const loginUser = async (reqBody) => {
  const { email, password } = reqBody;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Email not registered");
  }

  if (!bcrypt.compareSync(password, user.password)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Incorrect password");
  }

  const accessToken = createAccessToken({
    id: user._id,
    isAdmin: user.isAdmin,
  });
  const refreshToken = createRefreshToken({
    id: user._id,
    isAdmin: user.isAdmin,
  });

  return {
    message: "Login successful",
    accessToken,
    refreshToken,
  };
};

// Update user details
const updateUser = async (userId, data) => {
  const updatedUser = await User.findByIdAndUpdate(userId, data, { new: true });
  if (!updatedUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  const { password: _, ...userWithoutPassword } = updatedUser.toObject();
  return {
    message: "User updated successfully",
    data: userWithoutPassword,
  };
};

// Delete a user
const deleteUser = async (userId) => {
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  return { message: "User deleted successfully" };
};

// Get all users
const getAllUsers = async () => {
  const users = await User.find().select("-password"); // Exclude passwords
  return {
    message: "All users retrieved successfully",
    data: users,
  };
};

// Get user details by ID
const getUserDetails = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  return {
    message: "User details retrieved successfully",
    data: user,
  };
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserDetails,
};
