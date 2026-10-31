import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { validateLink } from "../validators/links.validator";
import { createLink, getLinks, updateLink, deleteLink } from "../services/links.service";

// =====================
// CREATE
// =====================

export async function create(
    req: AuthRequest,
    res: Response
): Promise<void> {

    const error = validateLink(req.body);

    if (error) {
        res.status(400).json({
            message: error
        });
        return;
    }

    try {

        await createLink(
            req.user!.userId,
            req.body.title,
            req.body.url,
            req.body.categoryId,
            req.body.description
        );

        res.status(201).json({
            message: "Link creato correttamente"
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

    const categoryId = req.query.categoryId
        ? Number(req.query.categoryId)
        : undefined;

    const links = await getLinks(
        req.user!.userId,
        categoryId
    );

    res.status(200).json(links);
}

// =====================
// UPDATE
// =====================

export async function update(
    req: AuthRequest,
    res: Response
): Promise<void> {

    const error = validateLink(req.body);

    if (error) {

        res.status(400).json({
            message: error
        });

        return;
    }

    try {

        await updateLink(
            req.user!.userId,
            Number(req.params.id),
            req.body.title,
            req.body.url,
            req.body.categoryId,
            req.body.description
        );

        res.status(200).json({
            message: "Link aggiornato correttamente"
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

        await deleteLink(
            req.user!.userId,
            Number(req.params.id)
        );

        res.status(200).json({
            message: "Link eliminato correttamente"
        });

    } catch (error) {

        res.status(404).json({
            message: (error as Error).message
        });

    }
}
