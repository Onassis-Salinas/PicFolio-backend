import express from "express";
import { changeUsername } from "../controllers/users.js";

const router = express.Router();

/**
 * @openapi
 * /users/username:
 *   put:
 *     tags:
 *     - Users
 *     responses:
 *       200:
 *         description: returns completed
 *     parameters:
 *     - name: username
 *     - name: lastUsername

 */
router.put("/username", changeUsername);

export default router;
