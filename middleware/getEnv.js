import dotenv from "dotenv";
dotenv.config();

const getEnv = async (req, res, next) => {
    req.env = process.env;
    next();
};

export default getEnv;
