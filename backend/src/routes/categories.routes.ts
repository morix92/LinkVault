import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { create, getAll, update, remove } from "../controllers/categories.controller";

const router = Router();

router.post("/", authenticateToken, create);
router.get("/", authenticateToken, getAll);
router.put("/:id", authenticateToken, update);
router.delete("/:id", authenticateToken, remove);

export default router;