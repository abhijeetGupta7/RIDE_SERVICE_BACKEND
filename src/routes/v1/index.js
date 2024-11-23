const authRouter = require("./authRoutes");
const bookingRouter = require("./bookingRoutes");
const driverRouter = require("./driverRoutes");
const passengerRouter = require("./passengerRoutes");

const v1Router=require("express").Router();

v1Router.use("/auth", authRouter);
 v1Router.use("/driver", driverRouter);
v1Router.use("/passenger", passengerRouter);
v1Router.use("/booking", bookingRouter);

module.exports=v1Router;

