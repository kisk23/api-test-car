import { Request, Response, NextFunction } from 'express'
import {
  getCustomerProfile,
  updateCustomerProfile,
  fetchCustomerBookings,
  fetchBookingById,
} from '../services/customer.service'
import { listCarsForCustomers, getCarById } from '../services/car.service'
import { getAvailableSlotsForCarService } from '../services/availbility.service'
import {
  bookCarSlotService,
  cancelBookingByCustomerService,
} from '../services/booking.service'
import { getDealerCarsService } from '../services/dealer.service'
const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.userId
  if (!userId) {
    return res.status(400).json({ message: 'User ID not found in token' })
  }

  try {
    const profile = await getCustomerProfile(userId)
    if (!profile) {
      return res.status(404).json({ message: 'Customer profile not found' })
    }
    return res.status(200).json(profile)
  } catch (error: unknown) {
    console.log(error)
    next(error)
  }
}

const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.userId
  if (!userId) {
    return res.status(400).json({ message: 'User ID not found in token' })
  }
  try {
    const updateData = req.body
    const updatedProfile = await updateCustomerProfile(userId, updateData)
    if (!updatedProfile) {
      return res.status(404).json({ message: 'Customer profile not found' })
    }
    return res.status(200).json({ message: 'Profile updated successfully' })
  } catch (error: unknown) {
    next(error)
  }
}

const listCars = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { brand, model, year, dealer, page, limit } = req.query

    const result = await listCarsForCustomers({
      brand: brand as string,
      model: model as string,
      dealerId: dealer as string,
      year: year ? Number(year) : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    })

    return res.status(200).json(result)
  } catch (error: unknown) {
    next(error)
  }
}
const getCarDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const carId = req.params.carId
    const car = await getCarById(carId)
    if (!car) {
      return res.status(404).json({ message: 'Car not found' })
    }
    return res.status(200).json(car)
  } catch (error: unknown) {
    next(error)
  }
}

const getAvailableSlotsForCar = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { carId } = req.params

    if (!carId) {
      throw new Error('Car ID is required')
    }

    const slots = await getAvailableSlotsForCarService(carId)

    return res.status(200).json({
      count: slots.length,
      slots,
    })
  } catch (err) {
    next(err)
  }
}

const createBookingForCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { carId, availabilityId } = req.body
    const customerId = req.user.userId

    const booking = await bookCarSlotService({
      carId,
      availabilityId,
      customerId,
    })

    res.status(200).json({
      message: 'Car booked successfully',
      booking,
    })
  } catch (err) {
    next(err)
  }
}

const getCustomerBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.userId
  if (!userId) {
    throw new Error('User ID not found in token')
  }
  try {
    const bookings = await fetchCustomerBookings(userId)
    if (!bookings) {
      throw new Error('Customer profile not found')
    }
    return res.status(200).json(bookings)
  } catch (error: unknown) {
    console.log(error)
    next(error)
  }
}
const getCustomerBookingById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bookingId = req.params.bookingId
    const booking = await fetchBookingById(bookingId)
    if (!booking) {
      throw new Error('Booking not found')
    }
    return res.status(200).json(booking)
  } catch (error: unknown) {
    next(error)
  }
}
const cancelBookingByCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { bookingId } = req.params
    const customerId = req.user.userId // auth middleware required

    const canceledBooking = await cancelBookingByCustomerService({
      bookingId,
      customerId,
    })

    res.status(200).json({
      message: 'Booking canceled successfully',
      booking: canceledBooking,
    })
  } catch (err) {
    next(err)
  }
}
export const getMyCars = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dealerId = req.user!.userId
    const cars = await getDealerCarsService(dealerId)
    res.json(cars)
  } catch (err) {
    next(err)
  }
}

export {
  getProfile,
  updateProfile,
  listCars,
  getCarDetails,
  getAvailableSlotsForCar,
  createBookingForCustomer,
  getCustomerBookings,
  getCustomerBookingById,
  cancelBookingByCustomer,
}
