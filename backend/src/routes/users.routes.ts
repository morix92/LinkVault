import { Router } from "express";

import { me, update, remove } from "../controllers/users.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/me", authenticateToken, me);
router.put("/me", authenticateToken, update);
router.delete("/me", authenticateToken, remove);

export default router;