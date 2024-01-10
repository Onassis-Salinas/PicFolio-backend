import sql from "../config/db.js";
import log from "../config/logger.js";
import sendError from "../config/sendError.js";
import jwt from "jsonwebtoken";

export const changeUsername = async (req, res) => {
    console.log("silly");
    if (!req.body.username) return sendError(res, 400, "Falta el nombre de usuario");
    if (!req.body.lastUsername) return sendError(res, 400, "Falta el anterior nombre de usuario");

    try {
        await sql`update "Users" set "Name" = ${req.body.username} where "Name" = ${req.body.lastUsername}`;

        if (!req.user === req.body.lastUsername) return res.send("esta mal");
        const token = jwt.sign({ username: req.body.username }, req.env.JWT_SECRET, {
            expiresIn: "24h",
        });

        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        })
            .cookie("username", req.body.username, { sameSite: "strict", maxAge: 24 * 60 * 60 * 1000 })
            .cookie("cookie", "fsdofnsd", { sameSite: "strict", maxAge: 24 * 60 * 60 * 1000 })
            .send("completed");
    } catch (err) {
        log.error(err);
        console.log(err.code);
        if (err.code == 23505) return sendError(res, 500, "Username is already in use");
        sendError(res, 500, err);
    }
};
