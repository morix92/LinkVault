import { Request, Response } from "express";
import { validateCredentials } from "../validators/auth.validator";
import { registerUser, loginUser } from "../services/auth.service";
import { AuthRequest } from "../middleware/auth.middleware";


// ==========================================
// REGISTER
// ==========================================

export async function register(
    req: Request,
    res: Response
): Promise<void> {

    const error = validateCredentials(req.body);

    if (error) {
        res.status(400).json({
            message: error
        });
        return;
    }

    try {

        await registerUser(
            req.body.username,
            req.body.password
        );

        res.status(201).json({
            message: "Utente registrato correttamente"
        });

    } catch (error) {

        res.status(400).json({
            message: (error as Error).message
        });

    }
}

// ==========================================
// LOGIN
// ==========================================

export async function login(
    req: Request,
    res: Response
): Promise<void> {

    const error = validateCredentials(req.body);

    if (error) {
        res.status(400).json({
            message: error
        });
        return;
    }

    try {

        const token = await loginUser(
            req.body.username,
            req.body.password
        );

        res.status(200).json({
            token
        });

    } catch (error) {

        res.status(401).json({
            message: (error as Error).message
        });

    }
}
