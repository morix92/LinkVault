import pool from "../database/database";

// =====================
// BUILD URL FAVICON
// =====================

function buildFaviconUrl(
    url: string
): string {

    const parsedUrl = new URL(url);

    return `${parsedUrl.protocol}//${parsedUrl.host}/favicon.ico`;
}

// =====================
// HELPER
// =====================

async function getDefaultCategoryId(
    userId: number
): Promise<number> {

    const result = await pool.query(
        "SELECT id FROM categories WHERE user_id = $1 AND name = 'Default'",
        [userId]
    );

    if (result.rows.length === 0) {
        throw new Error("Categoria Default non trovata");
    }

    return result.rows[0].id;
}

// =====================
// CREATE
// =====================

export async function createLink(
    userId: number,
    title: string,
    url: string,
    categoryId?: number,
    description?: string
): Promise<void> {

    let targetCategoryId = categoryId;

    if (!targetCategoryId) {
        targetCategoryId = await getDefaultCategoryId(
            userId
        );
    }

    const category = await pool.query(
        "SELECT id FROM categories WHERE id = $1 AND user_id = $2",
        [targetCategoryId, userId]
    );

    if (category.rows.length === 0) {
        throw new Error("Categoria non trovata");
    }

    const faviconUrl = buildFaviconUrl(url);

    await pool.query(
        `INSERT INTO links
        (user_id, category_id, title, description, url, image_url)
        VALUES
        ($1, $2, $3, $4, $5, $6)`,
        [ userId, targetCategoryId, title, description ?? null, url, faviconUrl ]
    );
}

// =====================
// READ
// =====================

export async function getLinks(
    userId: number,
    categoryId?: number
) {

    const query = categoryId
        ? `SELECT l.id, l.title, l.description, l.url, l.image_url, c.id AS category_id, c.name AS category_name
           FROM links l
           JOIN categories c
                ON c.id = l.category_id
           WHERE l.user_id = $1
           AND l.category_id = $2
           ORDER BY l.title`
        : `SELECT l.id, l.title, l.description, l.url, l.image_url, c.id AS category_id, c.name AS category_name
           FROM links l
           JOIN categories c
                ON c.id = l.category_id
           WHERE l.user_id = $1
           ORDER BY l.title`;

    const params = categoryId
        ? [userId, categoryId]
        : [userId];

    const result = await pool.query(query, params);

    return result.rows;
}


// =====================
// UPDATE
// =====================

export async function updateLink(
    userId: number,
    linkId: number,
    title: string,
    url: string,
    categoryId?: number,
    description?: string
): Promise<void> {

    const existingLink = await pool.query(
        "SELECT id FROM links WHERE id = $1 AND user_id = $2",
        [linkId, userId]
    );

    if (existingLink.rows.length === 0) {
        throw new Error("Link non trovato");
    }

    let targetCategoryId = categoryId;

    if (!targetCategoryId) {
        targetCategoryId = await getDefaultCategoryId(userId);
    }

    const category = await pool.query(
        "SELECT id FROM categories WHERE id = $1 AND user_id = $2",
        [targetCategoryId, userId]
    );

    if (category.rows.length === 0) {
        throw new Error("Categoria non trovata");
    }

    const faviconUrl = buildFaviconUrl(url);

    await pool.query(
        `UPDATE links
         SET title = $1, description = $2, url = $3, image_url = $4, category_id = $5
         WHERE id = $6
         AND user_id = $7`,
        [ title, description ?? null, url, faviconUrl, targetCategoryId, linkId, userId ]
    );
}


// =====================
// DELETE
// =====================

export async function deleteLink(
    userId: number,
    linkId: number
): Promise<void> {

    const result = await pool.query(
        "DELETE FROM links WHERE id = $1 AND user_id = $2 RETURNING id",
        [linkId, userId]
    );

    if (result.rows.length === 0) {
        throw new Error("Link non trovato");
    }
}
