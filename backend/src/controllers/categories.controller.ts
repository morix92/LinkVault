import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { validateCategory } from "../validators/categories.validator";
import { createCategory, getCategories, updateCategory, deleteCategory } from "../services/categories.service";

// =====================
// CREATE
// =====================

export async function create(
    req: AuthRequest,
    res: Response
): Promise<void> {

    const error = validateCategory(req.body);

    if (error) {
        res.status(400).json({
            message: error
        });
        return;
    }

    try {

        await createCategory(
            req.user!.userId,
            req.body.name
        );

        res.status(201).json({
            message: "Categoria creata correttamente"
        });

    } catch (error) {

        res.status(400).json({
            message: (error as Error).message
        });

    }
}

// =====================
// READ
// =====================

export async function getAll(
    req: AuthRequest,
    res: Response
): Promise<void> {

    const categories = await getCategories(
        req.user!.userId
    );

    res.status(200).json(categories);
}

// =====================
// UPDATE
// =====================

export async function update(
    req: AuthRequest,
    res: Response
): Promise<void> {

    const error = validateCategory(req.body);

    if (error) {
        res.status(400).json({
            message: error
        });
        return;
    }

    try {

        await updateCategory(
            req.user!.userId,
            Number(req.params.id),
            req.body.name
        );

        res.status(200).json({
            message: "Categoria aggiornata correttamente"
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

        await deleteCategory(
            req.user!.userId,
            Number(req.params.id)
        );

        res.status(200).json({
            message: "Categoria eliminata correttamente"
        });

    } catch (error) {

        res.status(404).json({
            message: (error as Error).message
        });

    }
}