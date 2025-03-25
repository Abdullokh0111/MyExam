const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET_TOKEN,
        { expiresIn: "1h" }
    );
};

module.exports =  generateToken ;
