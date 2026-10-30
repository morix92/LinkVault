import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../database/database";

// ==========================================
// REGISTER
// ==========================================

export async function registerUser(
    username: string,
    password: string
): Promise<void> {

    const existingUser = await pool.query(
        `SELECT id FROM users WHERE username = $1`,
        [username]
    );

    if (existingUser.rows.length > 0) {
        throw new Error("Username già esistente");
    }

    const passwordHash = await bcrypt.hash(
        password,
        10
    );

    await pool.query(
        `INSERT INTO users ( username, password_hash ) VALUES ( $1, $2 )`,
        [ username, passwordHash ]
    );
}


// ==========================================
// LOGIN
// ==========================================

export async function loginUser(
    username: string,
    password: string
): Promise<string> {

    const result = await pool.query(
        `SELECT id, username, password_hash FROM users WHERE username = $1`,
        [username]
    );

    if (result.rows.length === 0) {
        throw new Error("Credenziali non valide");
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!isPasswordValid) {
        throw new Error("Credenziali non valide");
    }

    const token = jwt.sign(
        {
            userId: user.id,
        },
        process.env.JWT_SECRET as string,
        {
            expiresIn: "24h"
        }
    );

    return token;
}