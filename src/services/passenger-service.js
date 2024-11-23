const PassengerRepository = require("../repositories/passenger-repository");

class PassengerService {
    #passengerRepository
    constructor() {
        this.#passengerRepository=new PassengerRepository();
    }

    async getAllBookings(passengerId) {
        try {
            const passenger=await this.#passengerRepository.getPassengerById(passengerId);
            if(!passenger) {
                throw new Error("No passenger exist for the given passenger id");
            }
            const passengerBookings=await this.#passengerRepository.getAllBookings(passengerId);
            return passengerBookings;
        } catch (error) {
            throw error;
        }
    }

    async provideFeedback(feedbackData) {
        try {
            const booking=await this.#passengerRepository.bookingRepository.get(feedbackData.bookingId);
            if(!booking) {
                throw new Error("Invalid Booking Id");
            }
            if(booking.passengerId!=feedbackData.passengerId) {
                throw new Error("No such booking for the given Passenger Id");
            }
            if(booking.status!='completed') {
                throw new Error("Booking has not been completed yet");
            }

            if (feedbackData.feedback) booking.feedback = feedbackData.feedback;
            if (feedbackData.rating) {
                if (feedbackData.rating < 1 || feedbackData.rating > 5) {
                    throw new Error("Rating must be between 1 and 5");
                }
                booking.rating = feedbackData.rating;
            }
            await booking.save();
            return booking;   
        } catch (error) {
            throw error;
        }
    }
}

module.exports=PassengerService;