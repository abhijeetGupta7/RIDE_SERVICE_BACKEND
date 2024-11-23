const { OK, INTERNAL_SERVER_ERROR, StatusCodes } = require("http-status-codes");
const { DriverService } = require("../services");
const successReponse = require("../utils/common/success-reponse");
const errorResponse = require("../utils/common/error-response");

const driverService=new DriverService();

async function getAllBookings(req,res) {
    try {
        const bookings=await driverService.getAllBookings(req.user.userId);
        if(!bookings) {
            successReponse.message="No booking exist for the given driver";
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
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

async function updateDriverLocation(req,res) {
    try {
        const response = await driverService.updateDriverLocation({
            driverId: req.user.userId,
            latitude: req.body.latitude,
            longitude: req.body.longitude
        })
        successReponse.data=response;
        successReponse.message="Successfully Updated the Driver Location";
        return res.status(StatusCodes.OK).json(successReponse);   
    } catch (error) {
        console.log(error);
        errorResponse.error={
            message: error.message
        }
        errorResponse.message="Something went wrong while updating the Driver location";
        return res.status(StatusCodes.NTERNAL_SERVER_ERROR).json(error);
    }
}

module.exports={
    getAllBookings,
    updateDriverLocation
}


