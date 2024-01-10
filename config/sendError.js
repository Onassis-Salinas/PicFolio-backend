import log from "./logger.js";

const sendError = (res, status, err = undefined) => {
    log.error(err);

    if (status === 500 && !err) err = "Error en el servidor";
    if (status === 404 && !err) err = "No encontrado";

    res.status(status).send(err);
};

export default sendError;
