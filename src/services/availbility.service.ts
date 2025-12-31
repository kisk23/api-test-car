
import { Availability } from '../models/avail.model'
import mongoose from 'mongoose'

 export const getAvailableSlotsForCarService = async (carId: string) => {
     if (!mongoose.Types.ObjectId.isValid(carId)) {
      throw new Error('Invalid car ID')
    }
  const now = new Date()

  const slots = await Availability.find({
    car: carId,
    isBooked: false,
    endTime: { $gt: now },
  })
    .sort({ startTime: 1 })
    .lean()

  return slots
}

const TIME_SLOTS = [
  9, 10, 11, 12, 14, 15, 16, 17
]

export const getCarAvailabilityForDate = async (
  carId: string,
  date: string // "2025-12-29"
) => {
  const dayStart = new Date(`${date}T00:00:00`)
  const dayEnd = new Date(`${date}T23:59:59`)
  const now = new Date()

  // Fetch booked slots for that day
  const bookedSlots = await Availability.find({
    car: carId,
    isBooked: true,
    startTime: { $gte: dayStart, $lte: dayEnd },
  }).lean()

  return TIME_SLOTS.map(hour => {
    const start = new Date(dayStart)
    start.setHours(hour, 0, 0, 0)

    const end = new Date(start)
    end.setHours(hour + 1)

    // Check if slot is in the past
    const isPast = end <= now

    // Check if slot is booked
    const isBooked = bookedSlots.some(slot =>
      start < slot.endTime && end > slot.startTime
    )

    return {
      time: `${hour}:00`,
      available: !isBooked && !isPast,
    }
  })
}



