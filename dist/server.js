import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.get("/", (_req, res) => {
    return res.json({
        message: "API online.",
    });
});
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map