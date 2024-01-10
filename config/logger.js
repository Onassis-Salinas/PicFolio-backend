import winston from "winston";
import dotenv from "dotenv";

dotenv.config()

const log = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: winston.format.cli(),
    transports: [new winston.transports.Console()],
});

export default log;
