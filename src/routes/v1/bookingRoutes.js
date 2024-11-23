const { createBooking, confirmBooking } = require("../../controllers/booking-controllers");
const { authenticateUser } = require("../../middlewares/authMiddlewares");

const bookingRouter=require("express").Router();

bookingRouter.post("/", authenticateUser , createBooking);
 bookingRouter.put("/:bookingId/confirm",authenticateUser, confirmBooking);

module.exports=bookingRouter;

