const { getAllBookings, updateDriverLocation, } = require("../../controllers/driver-controllers");
const { authenticateUser } = require("../../middlewares/authMiddlewares");

const driverRouter=require("express").Router();

driverRouter.get("/bookings", authenticateUser , getAllBookings);
driverRouter.patch("/location", authenticateUser, updateDriverLocation);

module.exports=driverRouter;

