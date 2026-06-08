import { Router } from "express";
import { login, logout, me, register } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { registrationMiddleware } from "../middlewares/registration.middleware.js";
const router = Router();
router.post("/register", registrationMiddleware, register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, me);
export default router;
//# sourceMappingURL=auth.routes.js.map