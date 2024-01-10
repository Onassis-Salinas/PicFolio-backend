import sql from "../config/db.js";
import log from "../config/logger.js";
import sendError from "../config/sendError.js";

export const visitHomePage = async (req, res) => {
    if (!req.body.username) return sendError(res, 400, "User not found");

    try {
        const [homepage] = await sql`select * from "HomePages" where "UserId" = (select "id" from "Users" where "Name" = ${req.body.username})`;
        if (!homepage) return sendError(res, 404, "User not found");
        const projects = await sql`select "id","Title",(select "Link" from "Images" where "id" = "DefaultImageId") as "DefaultImage" from "Projects" where "HomePageId" = ${homepage.id} order by "id" desc`;

        if (req.user && req.user.username === req.body.username) return res.send({ myHomepage: homepage, projects });
        res.send({ homepage, projects });
    } catch (err) {
        sendError(res, 500, err);
    }
};

export const editHomePage = async (req, res) => {
    if (!req.user) return sendError(res, 400, "You have no permission");
    if (!req.body.description) return sendError(res, 400, "Miising description");

    try {
        const [user] = await sql`select "id" from "Users" where "Name" = ${req.user.username}`;
        if (!user) return sendError(res, 400, "User not found");
        await sql`update "HomePages" set "Description" = ${req.body.description} where "UserId" = ${user.id}`;
        res.send("Ok");
    } catch (err) {
        sendError(res, 500, err);
    }
};

export const getPopularHomePages = async (req, res) => {
    try {
        const homepages = await sql`select (select "Name" from "Users" where "UserId" = "id") from "HomePages" Limit 30`;
        res.send(homepages);
    } catch (err) {
        log.error(err);
        sendError(res, 500, err);
    }
};

export const searchHomePages = async (req, res) => {
    if (!req.body.value) return getPopularHomePages(req, res);

    try {
        const homepages = await sql`select (select "Name" from "Users" where "UserId" = "id") from "HomePages" where (select "Name" from "Users" where "UserId" = "id") ilike ${`%${req.body.value}%`} limit 30`;
        res.send(homepages);
    } catch (err) {
        log.error(err);
        sendError(res, 500, err);
    }
};
