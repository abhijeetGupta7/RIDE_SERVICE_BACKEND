const { User } = require("../models");
const BookingRepository = require("./booking-repository");
const CrudRepository = require("./crud-respository");
const UserRepository = require("./user-repository");

class PassengerRepository extends CrudRepository {
    userRepository;
    bookingRepository;
    constructor() {
        super(User);
        this.userRepository=new UserRepository();
        this.bookingRepository=new BookingRepository();
    }
    
    async getAllBookings(passegerId) {
        const passengerBookings=await this.bookingRepository.getAllBookingsByPassenger(passegerId);
        return passengerBookings;            
    }

    async getPassengerById(passegerId) {
        const passenger=await User.findOne({_id:passegerId, role:'passenger'});
        return passenger;
    }
}


module.exports=PassengerRepository;