const {StatusCodes}= require('http-status-codes');
const {BookingService} = require('../services/index');


const bookingService = new BookingService();

const create = async (req,res)=>{
    try {
        const response = await bookingService.createBooking(req.body);
        console.log('From booking controller , try')
        return res.status(StatusCodes.OK).json({
            data : response,
            success : true , 
            err : {},
            message : 'Successfully created a booking'
        })
    } catch (error) {
        console.log('From booking controller , catch')
        return res.status(error.statusCode).json({
            data : {},
            success : false, 
            err : error.explanation,
            message : error.message
        })
    }
}

module.exports= { 
    create
}