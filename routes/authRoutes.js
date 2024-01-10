import express from "express";
import { checkLogin, loginUser, registerUser } from "../controllers/auth.js";

const router = express.Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *     - Auth
 *     responses:
 *       200:
 *         description: Returns a cookie with jwt
 *     parameters:
 *          - name: email
 *          - name: password
 */
router.post("/login", loginUser);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *     - Auth
 *     responses:
 *       200:
 *         description: calls /auth/login
 *     parameters:
 *     - name: username
 *     - name: password
 *     - name: email
 */
router.post("/register", registerUser);

/**
 * @openapi
 * /auth/check:
 *   get:
 *     tags:
 *     - Auth
 *     responses:
 *       200:
 *         description: checks if logged in
 *     parameters:
 *     - name: cookie with jwt
 */
router.get("/check", checkLogin);

export default router;
