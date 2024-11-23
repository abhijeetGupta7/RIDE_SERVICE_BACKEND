const { StatusCodes } = require("http-status-codes");
const UserService = require("../services/user-service");
const successReponse = require("../utils/common/success-reponse");
const errorResponse = require("../utils/common/error-response");

const userService=new UserService();


// ANOTHER TODO: currently only updateDriverLOcation API is pushing data in redisGeo DB, not this signup 
async function signUp(req,res) {
    try {
        console.log(req.body);
        const response=await userService.createUser({
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            password: req.body.password,
            location: req.body.location,
        });
        successReponse.data=response;
        successReponse.message="Successfully Created the User";
        return res.status(StatusCodes.CREATED).json(successReponse);        
    } catch (error) {
        console.log(error);
        errorResponse.error=error;
        errorResponse.message="Something went wrong while creating User";
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
}

async function signIn(req,res) {
    try {
        const response=await userService.signIn({
            email: req.body.email,
            password: req.body.password
        });
        successReponse.data=response;
        successReponse.message="Successfully Signed In";
        return res.status(StatusCodes.CREATED).json(successReponse);        
    } catch (error) {
        console.log(error);
        errorResponse.error={
            message: error.message
        }
        errorResponse.message="Something went wrong while SignIn";
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
}

module.exports={
    signUp,
    signIn
}