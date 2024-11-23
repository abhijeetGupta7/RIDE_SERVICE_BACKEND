const { signUp, signIn } = require("../../controllers/auth-controllers");

const authRouter=require("express").Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);

module.exports=authRouter;

