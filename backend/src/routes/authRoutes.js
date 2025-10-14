import express from "express";
import { signup, login, logout } from "../controllers/authController.js";
import { signupSchema, loginSchema } from "../validations/authValidation.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.post("/signup", validate(signupSchema) ,signup);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);

export default router;