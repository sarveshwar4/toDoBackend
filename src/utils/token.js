const jwt = require("jsonwebtoken");
const createAuthToken  = (user) => {
    try {
        const token = jwt.sign(
            {
                _id: user._id,
                role: user.role
            },
            process.env.SECRET_KEY,
            {
                expiresIn: "1d"
            }
        );
        return token;
    } catch (error) {
        throw new Error("Token creation failed: " + error.message);
    }
};

module.exports = {createAuthToken };