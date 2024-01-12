import express from "express";
import { uploadProjectImage, uploadProject, getProject, getPopularProjects, searchProjects, uploadProjectImages } from "../controllers/projects.js";
import upload from "../middleware/uploadImages.js";

const router = express.Router();

/**
 * @openapi
 * /projects/singleimage:
 *   post:
 *     tags:
 *     - Projects
 *     responses:
 *       200:
 *         description: returns image url
 *     parameters:
 *     - name: title
 *       in: query
 *     - name: projectId
 *       in: query
 *     - name: default
 *       in: query
 *     - name: IMAGE
 */
router.post("/singleimage", upload.array("files", 20), uploadProjectImage);

/**
 * @openapi
 * /projects/images:
 *   post:
 *     tags:
 *     - Projects
 *     responses:
 *       200:
 *         description: returns a completed message
 *     parameters:
 *     - name: metadata
 *     - name: files
 *       in: form
 */
router.post("/images", upload.array("files", 20), uploadProjectImages);

/**
 * @openapi
 * /projects/create:
 *   post:
 *     tags:
 *     - Projects
 *     responses:
 *       200:
 *         description: ok
 *     parameters:
 *     - name: title
 *     - name: layoutId
 *
 */
router.post("/create", uploadProject);

/**
 * @openapi
 * /projects:
 *   get:
 *     tags:
 *     - Projects
 *     responses:
 *       200:
 *         description: ok
 *     parameters:
 *     - name: projectId
 *       in: query
 */
router.get("/", getProject);

/**
 * @openapi
 * /projects/popular:
 *   get:
 *     tags:
 *     - Projects
 *     responses:
 *       200:
 *         description: returns tthe popular projects
 */
router.get("/popular", getPopularProjects);

/**
 * @openapi
 * /projects/search:
 *   post:
 *     tags:
 *     - Projects
 *     responses:
 *       200:
 *         description: returns the projects searched
 *     parameters:
 *     - name: value
 */
router.post("/search", searchProjects);

export default router;
