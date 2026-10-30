import pool from "../database/database";
import bcrypt from "bcrypt";


export async function userExists(
    userId: number
): Promise<boolean> {

    const result = await pool.query(
        "SELECT id FROM users WHERE id = $1",
        [userId]
    );

    return result.rows.length > 0;
}

// =====================
// GET PROFILE
// =====================

export async function getUserProfile(userId: number) {

    const result = await pool.query(
        "SELECT id, username FROM users WHERE id = $1",
        [userId]
    );

    return result.rows[0] ?? null;
}

// =====================
// UPDATE
// =====================

export async function updateUserProfile(
    userId: number,
    username?: string,
    password?: string
): Promise<void> {

    if (username) {

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE username = $1 AND id <> $2",
            [username, userId]
        );

        if (existingUser.rows.length > 0) {
            throw new Error("Username già esistente");
        }

        await pool.query(
            "UPDATE users SET username = $1 WHERE id = $2",
            [username, userId]
        );
    }

    if (password) {

        const passwordHash = await bcrypt.hash(password, 10);

        await pool.query(
            "UPDATE users SET password_hash = $1 WHERE id = $2",
            [passwordHash, userId]
        );
    }
}

// =====================
// DELETE
// =====================

export async function deleteUserProfile(
    userId: number
): Promise<void> {

    const result = await pool.query(
        "DELETE FROM users WHERE id = $1 RETURNING id",
        [userId]
    );

    if (result.rowCount === 0) {
        throw new Error("Utente non trovato");
    }
}