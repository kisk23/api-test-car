
import { Availability } from '../models/avail.model'
import mongoose from 'mongoose'

 const getAvailableSlotsForCarService = async (carId: string) => {
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




export { getAvailableSlotsForCarService }
