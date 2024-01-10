import express from "express";
import { visitHomePage, editHomePage, getPopularHomePages, searchHomePages } from "../controllers/homepages.js";
import validateToken from "../middleware/validateToken.js";

const router = express.Router();

/**
 * @openapi
 * /homepage/popular:
 *   get:
 *     tags:
 *     - Homepage
 *     responses:
 *       200:
 *         description: returns the popular homepages
 */
router.get("/popular", getPopularHomePages);

/**
 * @openapi
 * /homepage/search:
 *   post:
 *     tags:
 *     - Homepage
 *     responses:
 *       200:
 *         description: returns the homepages that you searched
 *     parameters:
 *     - name: value
 */
router.post("/search", searchHomePages);

/**
 * @openapi
 * /homepage:
 *   post:
 *     tags:
 *     - Homepage
 *     responses:
 *       200:
 *         description: returns the homepage and an array of projects
 *     parameters:
 *     - name: username
 */
router.post("/", visitHomePage);

/**
 * @openapi
 * /homepage:
 *   put:
 *     tags:
 *     - Homepage
 *     responses:
 *       200:
 *         description: edits the description
 *     parameters:
 *     - name: username
 *     - name: description
 */
router.put("/", editHomePage);

export default router;
