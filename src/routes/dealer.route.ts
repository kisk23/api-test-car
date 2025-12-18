import express from 'express'
const router = express.Router()

import { getProfile, updateProfile, createCar, updateCar, deleteCar, createSlot } from '../controllers/dealer.controller'
import { requireAuth, requireRole } from '../middlewares/authMiddleware'

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
//  */
router.post("/cars", createCar);
router.put("/cars/:carId", updateCar);
router.delete("/cars/:carId", deleteCar);

// Slots
router.post("/cars/:carId/slots", createSlot);

// /**
//  * Dealer bookings management (view bookings for their cars, approve, cancel)
//  */

//to do until we have a booking system fronted

// router.get("/bookings", dealerController.listBookings);
// router.patch("/bookings/:bookingId/confirm", dealerController.confirmBooking);
// router.patch("/bookings/:bookingId/cancel", dealerController.cancelBooking);

export default router;
