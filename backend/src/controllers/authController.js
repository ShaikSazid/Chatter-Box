import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import env from "../config/config.js";

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(409).json({ msg: "All fields are required" });
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ msg: "User with this email already exists" });
    const newUser = new User({ email, username, password });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, cookieOptions);
    return res
      .status(201)
      .json({
        msg: "Signed up successfully",
        user: { id: newUser._id, username: newUser.username },
      });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(409).json({ msg: "All fields are required" });
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "Invalid username or password" });
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ msg: "Invalid username or password" });
    const token = jwt.sign({ id: user._id }, env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, cookieOptions);
    return res
      .status(200)
      .json({
        msg: "Logged in successfully",
        user: { id: user._id, username: user.username },
      });
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res, next) => {
  res.clearCookie("token", cookieOptions);
  return res.status(200).json({ msg: "Logged out successfully" });
};