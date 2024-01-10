import postgres from "postgres";
import dotenv from "dotenv";
import log from "./logger.js";
dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
};

const sql = postgres(dbConfig);
log.info("Connected to DB");
export default sql;
