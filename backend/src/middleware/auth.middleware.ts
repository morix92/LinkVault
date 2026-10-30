import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        userId: number;
        username: string;
    };
}

export function authenticateToken(
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void {

    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({
            message: "Token mancante"
        });

        return;
    }

    const token = authHeader.split(" ")[1];

    try {

        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as {
            userId: number;
            username: string;
        };

        req.user = payload;

        next();

    } catch {

        res.status(401).json({
            message: "Token non valido"
        });
    }
}