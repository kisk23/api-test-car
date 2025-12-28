
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

// Book a car for a specific date and time
interface BookCarForDateTimeParams {
  carId: string
  customerId: string
  date: string // "2025-12-29"
  time: string // "9:00"
}

export const bookCarForDateTime = async ({
  carId,
  customerId,
  date,
  time,
}: BookCarForDateTimeParams) => {
  // Parse the time (e.g., "9:00" -> hour 9)
  const [hourStr] = time.split(':')
  const hour = parseInt(hourStr, 10)

  if (isNaN(hour) || hour < 0 || hour > 23) {
    throw new Error('Invalid time format. Expected format: "HH:00"')
  }

  // Create start and end datetime
  const startTime = new Date(`${date}T${hour.toString().padStart(2, '0')}:00:00`)
  const endTime = new Date(startTime)
  endTime.setHours(hour + 1)

  const now = new Date()

  // Check if the requested time is in the past
  if (startTime < now) {
    throw new Error('Cannot book a slot in the past')
  }

  // Check if there's already a slot for this car at this exact time
  const existingSlot = await Availability.findOne({
    car: carId,
    startTime: startTime,
    endTime: endTime,
  })

  if (existingSlot) {
    // Slot exists, check if it's already booked
    if (existingSlot.isBooked) {
      throw new Error('This time slot is already booked')
    }

    // Slot is available, book it
    existingSlot.isBooked = true
    existingSlot.bookedBy = new mongoose.Types.ObjectId(customerId)
    await existingSlot.save()

    return existingSlot
  }

  // No slot exists, we need to check if we can create one
  // First, check if there are any conflicting bookings
  const conflictingSlot = await Availability.findOne({
    car: carId,
    isBooked: true,
    $or: [
      // New slot starts during existing booking
      {
        startTime: { $lte: startTime },
        endTime: { $gt: startTime },
      },
      // New slot ends during existing booking
      {
        startTime: { $lt: endTime },
        endTime: { $gte: endTime },
      },
      // New slot completely contains existing booking
      {
        startTime: { $gte: startTime },
        endTime: { $lte: endTime },
      },
    ],
  })

  if (conflictingSlot) {
    throw new Error('This time slot conflicts with an existing booking')
  }

  // Create a new slot (we need the dealer ID from the car)
  const { Car } = await import('../models/car.model')
  const car = await Car.findById(carId)
  
  if (!car) {
    throw new Error('Car not found')
  }

  const newSlot = await Availability.create({
    car: carId,
    dealer: car.dealer,
    startTime,
    endTime,
    isBooked: true,
    bookedBy: customerId,
  })

  return newSlot
}