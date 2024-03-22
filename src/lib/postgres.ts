import postgres from "postgres";
import "dotenv/config";

export const sql = postgres(`${process.env.DB_URL}`);
