const addBookingJobtoQueue = require("../queue/BookingQueue");
const BookingRepository = require("../repositories/booking-repository");
const { calculateFare } = require("../utils/common/calculate-fare");
const LocationService = require("./location-service");

class BookingService {
    #bookingRepository;
    constructor() {
        this.locationService=new LocationService();
        this.#bookingRepository=new BookingRepository();
    }

    async createBooking({passengerId, source, destination}) {
        try {
            const fare=calculateFare(source.latitude,source.longitude,destination.latitude,destination.longitude);
            const bookingData={
                passengerId,
                source,
                destination,
                fare
            }
            const booking=await this.#bookingRepository.create(bookingData);
            addBookingJobtoQueue(booking);
            return booking;
        } catch (error) {
            throw error;
        }
    }


    async confirmBooking({ bookingId, driverId, io }) {
        const session = await this.#bookingRepository.startSession()
        session.startTransaction();

        try {
            // 1. Fetch the Booking from the DB with session
            const booking = await this.#bookingRepository.getBookingBySession(bookingId,session);
            if (!booking) {
                throw new Error("No booking for the given bookingId");
            }
            if (booking.status !== 'pending') {
                throw new Error('Booking already taken or cancelled');
            }
    
            // 2. Get the notifiedDriverIds
            const notifiedDriverIds = await this.locationService.getNotifiedDriverIds(bookingId);
            console.log("Dekh le inko gya THA  ",notifiedDriverIds)
            console.log("Ye h ki nhi dekh ",driverId)
            if (!notifiedDriverIds.includes(driverId)) {
                throw new Error('Driver not notified for this booking.');
            }
    
            // 3. Update the booking with driverId and status
            booking.driverId = driverId;
            booking.status = 'confirmed';
            await booking.save({ session }); // Save with session
            
            // Commit transaction
            await session.commitTransaction();
            
            // 4. Notify the confirming driver
            const driverSocketId = await this.locationService.getUserSocketId(driverId, 'driver');
            io.to(driverSocketId).emit('confirmBookingDriver', JSON.stringify(booking));
            
            // 5. Notify the passenger that booking is confirmed
            const passengerSocketId = await this.locationService.getUserSocketId(booking.passengerId, 'passenger');
            io.to(passengerSocketId).emit('confirmBookingPassenger', JSON.stringify(booking));
            
            // 6. Notify other drivers that booking has been taken
            const notificationPromises = notifiedDriverIds
            .filter(notifiedDriverId => notifiedDriverId !== driverId)
            .map(async notifiedDriverId => {
                const notifiedDriverSocketId = await this.locationService.getUserSocketId(notifiedDriverId, 'driver');
                io.to(notifiedDriverSocketId).emit('bookingTaken', JSON.stringify(booking));
            });
        
            await Promise.all(notificationPromises); // Wait for all notifications to be sent

            return booking;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
    
}

module.exports=BookingService;