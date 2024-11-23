const { StatusCodes } = require("http-status-codes");
const { verifyToken } = require("../utils/common/auth");
const { UserService } = require("../services");

const userService=new UserService();

async function authenticateUser(req, res, next) {
    const authHeader = req.headers['authorization']; 
    if (!authHeader) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "No auth header provided" }); 
    }
    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Invalid auth header format" });
    }
    const token = authHeader.split(' ')[1]; 
    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "No token provided" }); 
    }

    // Verify the token
    try {
        const decodedToken = await userService.authenticateUser(token);
        console.log(decodedToken);    //  { userId: '67083289dce80d10d739cee9', userEmail: 'abhi@gmail.com', iat: 1728813943,  exp: 1728900343 }
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid token" }); 
    }
}

module.exports = {
    authenticateUser
};
