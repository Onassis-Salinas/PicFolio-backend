import jwt from "jsonwebtoken";

const validateToken = async (req, res, next) => {
    req.user = null;

    try {
        const decoded = await jwt.verify(req.cookies.jwt, req.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        next();
    }
};

export default validateToken;
