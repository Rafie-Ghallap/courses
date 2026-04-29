const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
    console.log("Headers:", req.headers);
    const authHeader = req.headers['authorization'];
    const token=(authHeader && authHeader.split(' ')[1]) || req.headers.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    else {
        jwt.verify(token, process.env.JWT_SECRET, (error, decode) => {
            if (error) {
                return res.status(401).json({ message: error });
            } else {
                req.user = decode;
                next();
            }
        });
        
    }
}


module.exports = {checkAuth}