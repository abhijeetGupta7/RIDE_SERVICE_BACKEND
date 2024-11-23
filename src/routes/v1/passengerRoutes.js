const passengerController = require("../../controllers/passenger-controllers");
const { authenticateUser } = require("../../middlewares/authMiddlewares");

const passengerRouter=require("express").Router();

passengerRouter.get("/bookings",authenticateUser, passengerController.getAllBookings);
passengerRouter.patch("/feedback",authenticateUser, passengerController.provideFeedback);

module.exports=passengerRouter;

