import { User } from '../models/cusrtomer.model'
import { Car, CarDocument } from '../models/car.model'
import { Availability } from '../models/avail.model'
import mongoose from 'mongoose'

export const getDealerProfile = async (userId: string) => {
  const dealer = await User.findById(userId).select('-password').lean()

  if (!dealer) {
    throw new Error('Dealer not found')
  }

  return dealer
}

export const updateDealerProfile = async (
  userId: string,
  updates: Partial<{
    name: string
    email: string
    phone: string
    dealershipName: string
    dealershipLocation: string
  }>,
) => {
  // Update dealer info
  const updatedDealer = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }, // return updated document
  )
    .select('-password')
    .lean()

  if (!updatedDealer) {
    throw new Error('Dealer not found')
  }

  return updatedDealer
}

export const createCarsService = async ({
  dealer: dealerId,
  ...car
}: Partial<CarDocument>) => {
  return await Car.create({
    ...car,
    dealer: dealerId,
  })
}
export const updateCarService = async (
  carId: string,
  updates: Partial<CarDocument>,
) => {
  return await Car.findByIdAndUpdate(carId, { $set: updates }, { new: true })
}

export const deleteCarService = async (carId: string) => {
  return await Car.findByIdAndDelete(carId)
}

export const createSlotService = async (data: {
  car: string
  dealer: string
  startTime: Date
  endTime: Date
}) => {
  return await Availability.create(data)
}

/// list dealer bookings service
export const listDealerBookingsService = async (dealerId: string) => {
  return await Availability.find({
    dealer: dealerId,
    isBooked: true,
  })
    .populate('car', 'brand model year')
    .populate('bookedBy', 'name email phone')
    .sort({ startTime: 1 })
    .lean()
}

/// confirm booking service

export const confirmBookingService = async ({
  availabilityId,
  dealerId,
}: {
  availabilityId: string
  dealerId: string
}) => {
  if (!mongoose.Types.ObjectId.isValid(availabilityId)) {
    throw new Error('Invalid availability ID')
  }

  const slot = await Availability.findOne({
    _id: availabilityId,
    dealer: dealerId,
    isBooked: true,
  })

  if (!slot) {
    throw new Error('Booking not found or not booked yet')
  }

  return slot
}
/// cancel booking service

export const cancelBookingService = async ({
  availabilityId,
  dealerId,
}: {
  availabilityId: string
  dealerId: string
}) => {
  if (!mongoose.Types.ObjectId.isValid(availabilityId)) {
    throw new Error('Invalid availability ID')
  }

  const slot = await Availability.findOneAndUpdate(
    {
      _id: availabilityId,
      dealer: dealerId,
      isBooked: true,
    },
    {
      isBooked: false,
      bookedBy: null,
    },
    { new: true },
  )

  if (!slot) {
    throw new Error('Booking not found or already cancelled')
  }

  return slot
}
