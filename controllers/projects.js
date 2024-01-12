import dotenv from "dotenv";
import sql from "../config/db.js";
import log from "../config/logger.js";
import sendError from "../config/sendError.js";
import admin from "firebase-admin";

dotenv.config();

export const uploadProjectImage = async (req, res) => {
    if (!req.query.projectId) return sendError(res, 400, "Falta el project ID");
    if (!req.query.title) return sendError(res, 400, "Falta el titulo");
    if (!req.file) return sendError(res, 400, "Falta la imagen");

    const bucket = admin.storage().bucket();

    try {
        const fileName = Date.now() + "." + req.file.originalname.split(".")[1];
        const file = bucket.file(fileName);
        const stream = file.createWriteStream();
        stream.on("finish", async () => {
            const [metadata] = await file.getMetadata();

            const imageUrl = process.env.FIREBASE_BASE + fileName;
            const [image] = await sql`Insert into "Images" ("Link", "Title", "ProjectId") values (${imageUrl}, ${req.query.title}, ${req.query.projectId}) returning "id", "Link"`;
            console.log(image);
            if (req.query.default) await sql`update "Projects" set "DefaultImageId"=${image.id} where "id"=${req.query.projectId} `;
            res.send(image);
        });
        stream.end(req.file.buffer);
    } catch (err) {
        console.log(err);
        sendError(res, 500, err);
    }
};

export const uploadProjectImages = async (req, res) => {
    if (!req.files) return sendError(res, 400, "Faltan las imagenes");
    if (!req.body.metadata) return sendError(res, 400, "Falta la informacion");

    const bucket = admin.storage().bucket();
    const metadata = JSON.parse(req.body.metadata);

    req.files.forEach((file, i) => {
        const fileName = Date.now() + "." + file.originalname.split(".")[1];
        const firebaseFile = bucket.file(fileName);
        const stream = firebaseFile.createWriteStream();

        stream.on("finish", async () => {
            const imageUrl = process.env.FIREBASE_BASE + fileName;
            console.log(typeof metadata);
            console.log(req.body.metadata);
            const [image] = await sql`Insert into "Images" ("Link", "Title", "ProjectId") values (${imageUrl}, ${metadata[i].title ? metadata[i].title : ""}, ${metadata[i].projectId}) returning "id", "Link"`;
            if (metadata[i].defaultImage) await sql`update "Projects" set "DefaultImageId"=${image.id} where "id"=${metadata[i].projectId} `;

            if (i === metadata.length - 1) res.send("Uploaded");
        });
        stream.end(file.buffer);
    });
};

export const uploadProject = async (req, res) => {
    if (!req.body.title) return sendError(res, 400, "Falta el titulo");
    if (!req.user) return sendError(res, 401, "No esta iniciado sesion");

    try {
        const [project] = await sql`insert into "Projects" ("Title","LayoutId","HomePageId" ) values (${req.body.title}, ${req.body.layoutId},(select "id" from "HomePages" where "UserId" = (select "id" from "Users" where "Name" = ${req.user.username}))) returning "id"`;
        if (!project) return sendError(res, 404, "No se encontro homepage");

        log.silly("Project created");
        res.status(200).send({ id: project.id });
    } catch (err) {
        console.log(err);
        sendError(res, 500, err);
    }
};

export const getProject = async (req, res) => {
    if (!req.query.projectId) return sendError(res, 400, "Falta el project ID");

    try {
        const images = await sql`select "Link", "Title" from "Images" where "ProjectId" = ${req.query.projectId}`;
        const [project] = await sql`select "Title", "LayoutId" from "Projects" where "id" = ${req.query.projectId}`;
        res.send({ title: project.Title, layoutId: project.LayoutId, images });
    } catch (err) {
        sendError(res, 500, err);
    }
};

export const getPopularProjects = async (req, res) => {
    try {
        const projects = await sql`select "id","Title",(select "Link" from "Images" where "id" = "DefaultImageId") as "DefaultImage" from "Projects" order by "id" desc limit 30`;
        res.send(projects);
    } catch (err) {
        log.error(err);
        sendError(res, 500, err);
    }
};

export const searchProjects = async (req, res) => {
    if (!req.body.value) return getPopularProjects(req, res);

    try {
        const projects = await sql`select "id","Title",(select "Link" from "Images" where "id" = "DefaultImageId") as "DefaultImage" from "Projects" where "Title" ilike ${"%" + req.body.value + "%"} limit 30`;
        res.send(projects);
    } catch (err) {
        log.error(err);
        sendError(res, 500, err);
    }
};
