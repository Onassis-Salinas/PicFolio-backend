import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "../config/db.js";
import log from "../config/logger.js";
import sendError from "../config/sendError.js";

dotenv.config();

export const registerUser = async (req, res) => {
    if (!req.body.username) return sendError(res, 400, "Falta usuario");
    if (!req.body.password) return sendError(res, 400, "Falta contrasela");
    if (!req.body.email) return sendError(res, 400, "Falta email");

    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const [user] = await sql`insert into "Users" ("Name", "Email", "Password") values (${req.body.username}, ${req.body.email}, ${hash}) returning "id"`;
        await sql`insert into "HomePages" ("UserId") values (${user.id})`;

        log.silly("user registered");
        loginUser(req, res);
    } catch (err) {
        console.log(err);
        if (err.constraint_name === "unique_email") return sendError(res, 400, "Email already in use");
        sendError(res, 500, err);
    }
};

export const loginUser = async (req, res) => {
    if (!req.body.email) return sendError(res, 400, "Falta correo");
    if (!req.body.password) return sendError(res, 400, "Falta contraseña");

    try {
        const [user] = await sql`select "Password", "Name", "Email" from "Users" where "Email" = ${req.body.email}`;
        if (!user) return sendError(res, 400, "No hay cuenta con ese correo");
        2;
        const match = await bcrypt.compare(req.body.password, user.Password);
        if (!match) return sendError(res, 400, "Contraseña incorrecta");

        const token = jwt.sign({ username: user.Name }, req.env.JWT_SECRET, {
            expiresIn: "24h",
        });
        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
            domain: process.env.DOMAIN,
        })
            .cookie("username", user.Name, {
                sameSite: "none",
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
                domain: process.env.DOMAIN,
            })
            .status(200)
            .send("user logged in");

        log.silly("user logged in");
    } catch (err) {
        sendError(res, 500, err);
    }
};

export const checkLogin = async (req, res) => {
    try {
        console.log(req.user || "No hay sesion");
        if (!req.user) return res.send("No hay sesion");

        res.send(req.user);
    } catch (err) {
        sendError(res, 500, err);
    }
};
