const axios = require('axios');
const {FLIGHT_SERVICE_PATH} = require('../config/serverConfig');
const {BookingRepository} = require('../repository/index');
const { ServiceError } = require('../utils/errors');

class BookingService {
    constructor(){
       this.bookingRepository = new BookingRepository();
    }
    
    async createBooking(data){
        try {
            const flightId = data.flightId;
            let getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const flight = await axios.get(getFlightRequestURL);
            console.log('1');
            const flightData = flight.data.data;
            let priceOfTheFlight = flightData.price;
            if(data.noOfSeats > flightData.totalSeats){
                throw new ServiceError('Something went wrong in the booking process' , 'Insufficient Seats')
            }
            console.log('2');
            const totalCost = priceOfTheFlight*data.noOfSeats;
            const bookingPayload = {...data , totalCost};
            const booking = await this.bookingRepository.create(bookingPayload);
            const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`
            console.log('3');
            await axios.patch(updateFlightRequestURL , {totalSeats : flightData.totalSeats - booking.noOfSeats});
            console.log('4');
           const finalbooking =  await this.bookingRepository.update(booking.id,{status : "BOOKED"})
            return finalbooking
           
        } catch (error) {
           if(error.name == 'RepositoryError' || error.name == 'ValidationError'){
                throw error
           }
            throw new ServiceError();
        }
    }

}

module.exports = BookingService;