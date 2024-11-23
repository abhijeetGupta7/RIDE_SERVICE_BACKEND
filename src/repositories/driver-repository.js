const { User } = require("../models");
const BookingRepository = require("./booking-repository");
const CrudRepository = require("./crud-respository");
const UserRepository = require("./user-repository");

class DriverRepository extends CrudRepository {
    userRepository;
    bookingRepository;
    constructor() {
        super(User);
        this.userRepository=new UserRepository();
        this.bookingRepository=new BookingRepository();
    }
    
    async getAllBookings(driverId) {

        const driverBookings=await this.bookingRepository.getAllBookingsByDriver(driverId);
        return driverBookings;            
    }

    async getdriverById(driverId) {
        const driver=await User.findOne({_id:driverId, role:'driver'});
        return driver;
    }
}


module.exports=DriverRepository;