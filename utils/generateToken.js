const jwt = require("jsonwebtoken");

const accessToken = (user) => {
    return jwt.sign(
        {
            userInfo: {
                id: user._id,
                name: user.name,
                role: user.role,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "15mins",
        }
    );
};
const refreshToken = (res, userId) => {
    const refreshToken = jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "1d",
        }
    );
    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https
        sameSite: "None", //cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });
};

module.exports = { accessToken, refreshToken };
