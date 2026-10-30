import "./config/env";

import app from "./app";
import pool from "./database/database";

const PORT = Number(process.env.BACKEND_PORT) || 3000;

async function startServer(): Promise<void> {
    try {

        await pool.query("SELECT NOW()");

        console.log("Connessione al database stabilita correttamente.");

        app.listen(PORT, () => {
            console.log(`Server avviato sulla porta ${PORT}`);
        });

    } catch (error) {

        console.error("Errore durante la connessione al database:");

        console.error(error);

        process.exit(1);
    }
}

startServer();