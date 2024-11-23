const { OK, INTERNAL_SERVER_ERROR } = require("http-status-codes");
const { PassengerService } = require("../services");
const successReponse = require("../utils/common/success-reponse");
const errorResponse = require("../utils/common/error-response");

const passengerService=new PassengerService();

async function getAllBookings(req,res) {
    try {
        const bookings=await passengerService.getAllBookings(req.user.userId);
        if(!bookings) {
            successReponse.message="No booking exist for the given passenger";
        }
        else {
            successReponse.data=bookings;
            successReponse.message="Successfully fetched all the bookings";
        }
        return res.status(OK).json(successReponse);
    } catch (error) {
        console.log(error);
        errorResponse.error={
            message: error.message
        }
        errorResponse.message="Something went wrong while fetching the bookings";
        return res.status(INTERNAL_SERVER_ERROR).json(error);
    }
}

async function provideFeedback(req,res) {
    try {
        const booking=await passengerService.provideFeedback({
            bookingId:req.body.bookingId,
            passengerId:req.user.userId,
            feedback:req.body.feedback,
            rating:req.body.rating,
        })
        successReponse.data=booking;
        successReponse.message="Successfully provided the feedback";
        return res.status(OK).json(successReponse);
    } catch (error) {
        console.log("Inside" ,error);
        errorResponse.error={
            message: error.message
        }
        errorResponse.message="Something went wrong while giving feedback";
        return res.status(INTERNAL_SERVER_ERROR).json(errorResponse);
    }
}

module.exports={
    getAllBookings,
    provideFeedback
}


