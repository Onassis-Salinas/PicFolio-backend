import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import log from "./config/logger.js";
import cors from "cors";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import getEnv from "./middleware/getEnv.js";
import validateToken from "./middleware/validateToken.js";

import authRoutes from "./routes/authRoutes.js";
import homepagesRoutes from "./routes/homepagesRoutes.js";
import startRoutes from "./routes/startRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import projectsRoutes from "./routes/projectsRoutes.js";
import swaggerDocs from "./config/swagger.js";

import admin from "firebase-admin";
import credentials from "./config/credentials.json" assert { type: "json" };
admin.initializeApp({
    credential: admin.credential.cert(credentials),
    storageBucket: "gs://picfolio-390ab.appspot.com",
});

dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.API_PORT || 3000;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());
app.use(getEnv);
app.use(validateToken);

app.use("/auth", authRoutes);
app.use("/homepage", homepagesRoutes);
app.use("/start", startRoutes);
app.use("/users", usersRoutes);
app.use("/projects", projectsRoutes);
app.use("/images", express.static(join(__dirname, "images")));

app.listen(port, () => {
    log.info(`App initialized in port: ${port}`);
    swaggerDocs(app, port);
});
