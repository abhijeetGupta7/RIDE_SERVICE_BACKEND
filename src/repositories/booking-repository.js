const { Booking } = require("../models");
const CrudRepository = require("./crud-respository");

class BookingRepository extends CrudRepository {
    constructor() {
        super(Booking);
    } 

    async startSession() {
        return await Booking.startSession();
    }

    async getBookingBySession(bookingId,session) {
        return await Booking.findById(bookingId).session(session);
    }

    async getAllBookingsByPassenger(passengerId) {
        const bookings=await Booking.find({passengerId: passengerId});
        return bookings;
    }

    async getAllBookingsByDriver(driverId) {
        const bookings=await Booking.find({driverId: driverId});
        return bookings;
    }
}


module.exports=BookingRepository;