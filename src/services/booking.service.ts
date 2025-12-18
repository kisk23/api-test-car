
import mongoose from 'mongoose'
import { Availability } from '../models/avail.model'


// book a slot for how many hours to add later on 
interface BookingParams {
    
    carId: string;
    availabilityId: string;
    customerId: string;
    
}
export const bookCarSlotService = async ( { carId, availabilityId, customerId }: BookingParams) => {
  if (!mongoose.Types.ObjectId.isValid(availabilityId)) {
    throw new Error('Invalid availabilityId')
  }

  const now = new Date()

  const bookedSlot = await Availability.findOneAndUpdate(
    {
      _id: availabilityId,
      car: carId,
      isBooked: false,
      startTime: { $gte: now }, 
    },
    {
      $set: {
        isBooked: true,
        bookedAt: now,
        bookedBy: customerId, 
      },
    },
    {
      new: true,
    }
  )

  if (!bookedSlot) {
    throw new Error(
      'Slot not available, already booked, expired, or does not belong to this car'
    )
  }

  return bookedSlot
}

// services/booking.service.js



export const cancelBookingByCustomerService = async ({
  bookingId,
  customerId,
}: {
  bookingId: string;
  customerId: string;
}) => {
  const validBookingId = mongoose.Types.ObjectId.isValid(bookingId)
  if (!validBookingId) {

    throw new Error('Invalid bookingId')
  }

  const now = new Date()

  const filter = {
    _id: bookingId,
    isBooked: true,
    bookedBy: customerId,
    startTime: { $gt: now },
  }

  const update = {
    $set: {
      isBooked: false,
      bookedBy: null,
      canceledAt: now,

    },
  }

  const canceledSlot = await Availability.findOneAndUpdate(filter, update, { new: true })


  if (!canceledSlot) {
    throw new Error(
      'Booking not found, already canceled, expired, or not owned by customer'
    )
  }


  return canceledSlot
}