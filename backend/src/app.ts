import express from "express";
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import categoriesRoutes from "./routes/categories.routes";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        service: "linkvault-backend"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/categories", categoriesRoutes);


export default app;