import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import log from "./logger.js";
import path from "path";
import { fileURLToPath } from "url";

const options = {
    failOnErrors: true,
    definition: {
        openapi: "3.0.0",
        info: { title: "Photographer Portfolios API", version: "1.0.0" },
    },
    apis: [path.dirname(fileURLToPath(import.meta.url)) + "/../routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app, port) => {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    log.info("Documentation ready in /docs");
};

export default swaggerDocs;
