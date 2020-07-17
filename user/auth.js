

var jwt = require("jsonwebtoken");
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "Vienvu dep trai vcl";
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "1h";
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "3650d";
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "Vienvu dep trai vcl";



let generateToken = (user, secretSignature, tokenLife) => {
    return new Promise((resolve, reject) => {
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
        }
        // Thực hiện ký và tạo token
        jwt.sign(
            { data: userData },
            secretSignature,
            {
                algorithm: "HS256",
                expiresIn: tokenLife,
            },
            (error, token) => {
                if (error) {
                    return reject(error);
                }
                resolve(token);
            });
    });
}


let verifyToken = (token, secretKey) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (error, decoded) => {
            if (error) {
                return reject(error);
            }
            resolve(decoded);
        });
    });
}



let isAuth = async (req, res, next) => {
    const tokenFromClient = req.headers["authorization"];
    if (tokenFromClient) {
        try {
            const decoded = await verifyToken(tokenFromClient, accessTokenSecret);
            req.jwtDecoded = decoded;
            next();
        } catch (error) {
            res.status(401).json({
                message: 'Unauthorized.',
                success: false
            });
        }
    } else {
        res.status(403).send({
            message: 'No token provided.',
            success: false
        });
    }
}


let getInfo = (token) => {
    try {
        return jwt.decode(token)
    } catch (e) {
        return e
    }
}

module.exports = { getInfo, isAuth, verifyToken, generateToken, accessTokenLife, accessTokenSecret, refreshTokenLife, refreshTokenSecret }