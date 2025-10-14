import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import env from "../config/config.js";

export const auth = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if(!token) return res.status(401).json({ msg: "Not authorized, token missing "});
        const decoded = jwt.verify(token, env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if(!user) return res.status(401).json({ msg: "Not authorized, user not found" });
        req.user = { id: user._id };
        next();
    } catch (err) {
        console.error("Auth middleware error: ", err.message);
        return res.status(401).json({ msg: "Not authorized, token invalid" });
    }
}