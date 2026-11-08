import pool from "../database/database";

// =====================
// CREATE
// =====================

export async function createCategory(
    userId: number,
    name: string
): Promise<void> {

    const existingCategory = await pool.query(
        "SELECT id FROM categories WHERE user_id = $1 AND name = $2",
        [userId, name]
    );

    if (existingCategory.rows.length > 0) {
        throw new Error("Categoria già esistente");
    }

    await pool.query(
        "INSERT INTO categories (user_id, name) VALUES ($1, $2)",
        [userId, name]
    );
}

// =====================
// READ
// =====================

export async function getCategories(
    userId: number
) {

    const result = await pool.query(
        "SELECT id, name FROM categories WHERE user_id = $1 ORDER BY id",
        [userId]
    );

    return result.rows;
}

// =====================
// UPDATE
// =====================

export async function updateCategory(
    userId: number,
    categoryId: number,
    name: string
): Promise<void> {

    const category = await pool.query(
        "SELECT id FROM categories WHERE id = $1 AND user_id = $2",
        [categoryId, userId]
    );

    if (category.rows.length === 0) {
        throw new Error("Categoria non trovata");
    }

    const categoryInfo = await pool.query(`SELECT name FROM categories WHERE id = $1 AND user_id = $2`, [categoryId, userId]);

    if ( categoryInfo.rows[0].name === 'Default') {
        throw new Error('La categoria Default non può essere modificata');
    }

    const existingCategory = await pool.query(
        "SELECT id FROM categories WHERE user_id = $1 AND name = $2 AND id <> $3",
        [userId, name, categoryId]
    );

    if (existingCategory.rows.length > 0) {
        throw new Error("Nome Categoria già utilizzato");
    }

    await pool.query(
        "UPDATE categories SET name = $1 WHERE id = $2",
        [name, categoryId]
    );
}

// =====================
// DELETE
// =====================

export async function deleteCategory(userId: number, categoryId: number): Promise<void> {

    const category = await pool.query(
        `SELECT id, name
         FROM categories
         WHERE id = $1
         AND user_id = $2`,
        [categoryId, userId]
    );

    if (category.rows.length === 0) {
        throw new Error(
            'Categoria non trovata'
        );
    }

    if (category.rows[0].name === 'Default') {
        throw new Error(
            'La categoria Default non può essere eliminata'
        );
    }

    const defaultCategoryId = await getDefaultCategoryId(userId);
        await pool.query(
            `UPDATE links
            SET category_id = $1
            WHERE user_id = $2
            AND category_id = $3`,
            [defaultCategoryId, userId, categoryId]
        );

    const result = await pool.query(
        `DELETE FROM categories
         WHERE id = $1
         AND user_id = $2
         RETURNING id`,

        [categoryId, userId]
    );

    if (result.rowCount === 0) {
        throw new Error(
            'Categoria non trovata'
        );
    }

}

async function getDefaultCategoryId(userId: number): Promise<number> {
    const result = await pool.query(
        `SELECT id
         FROM categories
         WHERE user_id = $1
         AND name = 'Default'`,
        [userId]
    );

    if (result.rows.length === 0) {
        throw new Error(
            'Categoria Default non trovata'
        );
    }

    return result.rows[0].id;
}