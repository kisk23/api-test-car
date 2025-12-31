import express from 'express'
const router = express.Router()

import {
  getProfile,
  updateProfile,
  listCars,
  getCarDetails,
  
  createBookingForCustomer,
  getCustomerBookings,
  getCustomerBookingById,
  cancelBookingByCustomer,
  getCarAvailabilityForSpecificDate,
  bookCarForSpecificDateTime,
} from '../controllers/customer.controller'
import { requireAuth, requireRole } from '../middlewares/authMiddleware'

/**
 * PUBLIC ROUTES (no authentication required)
 */
router.get('/cars', listCars) // query: brand, model, year, dealer, page, limit
router.get('/cars/:carId', getCarDetails)
router.get('/cars/:carId/availability', getCarAvailabilityForSpecificDate)

/**
 * PROTECTED ROUTES (authentication required)
 */

// Profile routes
router.get('/me', requireAuth, requireRole('customer'), getProfile)
router.put('/me', requireAuth, requireRole('customer'), updateProfile)

// Booking routes
router.post('/cars/:carId/book', requireAuth, requireRole('customer'), bookCarForSpecificDateTime)
router.post('/bookings', requireAuth, requireRole('customer'), createBookingForCustomer)
router.get('/bookings', requireAuth, requireRole('customer'), getCustomerBookings)
router.get('/bookings/:bookingId', requireAuth, requireRole('customer'), getCustomerBookingById)
router.patch('/bookings/:bookingId/cancel', requireAuth, requireRole('customer'), cancelBookingByCustomer)

export default router
