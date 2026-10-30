import { Response } from "express";

import { AuthRequest } from "../middleware/auth.middleware";
import { getUserProfile, updateUserProfile, deleteUserProfile } from "../services/users.service";
import { validateUpdateUser } from "../validators/users.validator";


// =====================
// ME
// =====================

export async function me(
    req: AuthRequest,
    res: Response
): Promise<void> {

    const user = await getUserProfile(
        req.user!.userId
    );

    if (!user) {

        res.status(404).json({
            message: "Utente non trovato"
        });

        return;
    }

    res.status(200).json(user);
}

// =====================
// UPDATE
// =====================

export async function update(
    req: AuthRequest,
    res: Response
): Promise<void> {

    const error = validateUpdateUser(req.body);

    if (error) {

        res.status(400).json({
            message: error
        });

        return;
    }

    try {

        await updateUserProfile(
            req.user!.userId,
            req.body.username,
            req.body.password
        );

        res.status(200).json({
            message: "Profilo aggiornato correttamente"
        });

    } catch (error) {

        res.status(400).json({
            message: (error as Error).message
        });

    }
}

// =====================
// DELETE
// =====================

export async function remove(
    req: AuthRequest,
    res: Response
): Promise<void> {

    try {

        await deleteUserProfile(
            req.user!.userId
        );

        res.status(200).json({
            message: "Utente eliminato correttamente"
        });

    } catch (error) {

        res.status(404).json({
            message: (error as Error).message
        });

    }
}