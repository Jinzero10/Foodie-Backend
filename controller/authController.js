const User = require("../models/userModels");
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");

//Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //confirm data
        if (!email || !password) {
            return res.status(400).json({
                message: "All feilds are required",
            });
        }
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const accessToken = generateToken.accessToken(user);
            generateToken.refreshToken(res, user._id);

            res.status(201).json({
                accessToken,
            });
        } else {
            res.status(400).json({ message: "Invalid Email or Password" });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error in Authentication",
        });
    }
};

//logut
const logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.json({ message: "Cookie clear" });
};

//refresh token
const refresh = async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.jwt)
        return res.status(401).json({ message: "you dont have Cookie" });

    const refreshToken = cookies.jwt;

    if (!refreshToken) return res.status(401).json("You are not Authenticated");

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: "Forbidden" });

            const user = await User.findById(decoded.userId).exec();

            if (!user) return res.status(401).json({ message: "Unauthorized" });

            const newAccessToken = generateToken.accessToken(user);

            res.status(200).json({
                accessToken: newAccessToken,
            });
        }
    );
};
module.exports = { login, logout, refresh };
