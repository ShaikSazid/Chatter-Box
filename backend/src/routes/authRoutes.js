import express from "express";
import User from "../models/userModel.js";
import { signup, login, logout } from "../controllers/authController.js";
import { signupSchema, loginSchema } from "../validations/authValidation.js";
import { validate } from "../middlewares/validate.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", validate(signupSchema) ,signup);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/verify", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("username email"); 
  if (!user) return res.status(404).json({ msg: "User not found" });

  res.json({ user: { id: user._id, username: user.username } }); 
});

export default router;