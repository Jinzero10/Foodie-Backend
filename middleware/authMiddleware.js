const jwt = require("jsonwebtoken");
const User = require("../models/userModels");

const protect = async (req, res, next) => {
    try {
        const authHeader =
            req.headers.authorization || req.headers.Authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    message: "Token is not valid",
                });
            }
            req.id = decoded.userInfo.id;
            req.role = decoded.userInfo.role;
            next();
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Not Authorized, Invalid Token",
            error,
        });
    }
};

//admin access
const isAdmin = async (req, res, next) => {
    try {
        const role = req.role;

        if (role !== 101) {
            return res.status(401).json({
                message: "UnAuthorized Access",
            });
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: "Error in admin middleware",
        });
    }
};
const testController = (req, res) => {
    res.send("test");
};

module.exports = { protect, isAdmin, testController };
