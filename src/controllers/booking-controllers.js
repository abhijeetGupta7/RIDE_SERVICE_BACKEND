const { StatusCodes } = require("http-status-codes");
const BookingService = require("../services/booking-service");
const successReponse = require("../utils/common/success-reponse");
const errorResponse = require("../utils/common/error-response");

const bookingService=new BookingService();

async function createBooking(req,res) {
    try {
        const booking=await bookingService.createBooking({
            passengerId: req.user.userId,
            source: req.body.source,
            destination: req.body.destination
        });
        successReponse.data=booking;
        successReponse.message="Successfully Initiated the booking";
        return res.status(StatusCodes.CREATED).json(successReponse);
    } catch (error) {
        console.log(error);
        errorResponse.error={
            message: error.message
        }
        errorResponse.message="Something went wrong";
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
}

async function confirmBooking(req,res) {
    try {

        const booking=await bookingService.confirmBooking({
            bookingId:req.params.bookingId,
            driverId:req.user.userId,
            io:req.io
        });
        successReponse.data=booking;
        successReponse.message="Booking Successfully Confirmed";
        return res.status(StatusCodes.OK).json(successReponse);
    } catch (error) {
        console.log(error);
        errorResponse.error={
            message: error.message
        }
        errorResponse.message="Something went wrong";
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
}

module.exports={
    createBooking,
    confirmBooking
}