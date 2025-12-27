import express from 'express'
const router = express.Router()

import {
  getProfile,
  updateProfile,
  createCar,
  updateCar,
  deleteCar,
  confirmBooking,
  cancelBooking,
} from '../controllers/dealer.controller'
import { requireAuth, requireRole } from '../middlewares/authMiddleware'
import { listDealerBookings } from '../controllers/dealer.controller'
import { getMyCars } from '../controllers/customer.controller'
// // All dealer routes require dealer role
router.use(requireAuth, requireRole('dealer'))

// /**
//  * Dealer profile
//  */
// GET dealer profile
router.get('/me', getProfile)
// Update dealer profile
router.put('/me', updateProfile)

// /**
//  * Dealer car management

router.get('/me/cars', getMyCars)

//  */ crud
router.post('/cars', createCar)
router.put('/cars/:carId', updateCar)
router.delete('/cars/:carId', deleteCar)

// /**
//  * Dealer bookings management (view bookings for their cars, approve, cancel)
//  */

//to do until we have a booking system fronted

router.get('/bookings', listDealerBookings)
router.patch('/bookings/:bookingId/confirm', confirmBooking)
router.patch('/bookings/:bookingId/cancel', cancelBooking)

export default router
