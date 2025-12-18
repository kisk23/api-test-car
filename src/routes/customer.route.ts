import express from 'express'
const router = express.Router()

import {
  getProfile,
  updateProfile,
  listCars,
  getCarDetails,
  getAvailableSlotsForCar,
  createBookingForCustomer,
  getCustomerBookings,
  getCustomerBookingById
  ,cancelBookingByCustomer
} from '../controllers/customer.controller'
// import bookingController from "../controllers/booking.controller";
import { requireAuth, requireRole } from '../middlewares/authMiddleware'

// Apply: all routes in this router require auth + customer role
router.use(requireAuth, requireRole('customer'))

/**
 * PROFILE
 */
router.get('/me', getProfile )
router.put('/me', updateProfile )

/**customer.route.ts
 * CARS (browse)
 */
router.get('/cars', listCars) // query: brand, model, year, dealer, page, limit
router.get('/cars/:carId', getCarDetails)

/**
 * AVAILABILITY
 */
router.get('/cars/:carId/slots', getAvailableSlotsForCar)

/**
 * BOOKINGS (customer-side)
 */
router.post('/bookings', createBookingForCustomer)
router.get('/bookings', getCustomerBookings)
router.get("/bookings/:bookingId", getCustomerBookingById);

router.patch("/bookings/:bookingId/cancel", cancelBookingByCustomer);


export default router
