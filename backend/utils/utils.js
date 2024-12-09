const jwt = require("jsonwebtoken");

exports.generateToken = (payload) => {
    return jwt.sign(
        {
            userId: payload._id,
            role: payload.role
        }, 
        process.env.JWT_TOKEN,
        {
            expiresIn: "7d",
        }
    );
};

exports.verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_TOKEN);
};