import { User, UserDocument } from '../models/cusrtomer.model'
import mongoose from 'mongoose'
import { Availability } from '../models/avail.model'

const getCustomerProfile = async (
  customerId: string,
): Promise<UserDocument | null> => {
  // Excludes the password field from the returned document.
  const customer = await User.findById(customerId).select('-password')
  return customer
}

const updateCustomerProfile = async (
  customerId: string,
  updateData: Partial<UserDocument>,
): Promise<UserDocument | null> => {
  const updatedCustomer = await User.findByIdAndUpdate(customerId, updateData, {
    new: true,
  })
  return updatedCustomer
}



 const fetchCustomerBookings = async (customerId: string) => {
  // 1. Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    throw new Error('Invalid customerId')
  }

  // 2. Fetch only confirmed bookings
  const bookings = await Availability.find({
    bookedBy: customerId,
    isBooked: true,
  })
    .select(
      'startTime endTime status car dealer createdAt'
    )
    .populate('car', 'name model')
    .populate('dealer', 'name')
    .sort({ startTime: -1 })
    .lean()

  return bookings
}
const fetchBookingById = async (bookingId: string) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new Error('Invalid bookingId')
  }

  const booking = await Availability.findById(bookingId)
    .populate('car', 'name model')
    .populate('dealer', 'name')
    .lean()

  return booking
}

export { getCustomerProfile, updateCustomerProfile, fetchCustomerBookings, fetchBookingById }
