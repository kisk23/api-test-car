import { createCarSchema } from './../validations/carCreation';
import { updateCarSchema } from '../validations/carUpdate'
import { Request, Response, NextFunction } from 'express'
import {
  getDealerProfile,
  updateDealerProfile,
  createCarsService,
  updateCarService,
  deleteCarService,
  createSlotService,
} from '../services/dealer.service'
import { Types } from 'mongoose'



// Controller to get the logged-in dealer's profile
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Check if user exists in request (set by JWT middleware)
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    // Fetch dealer profile from service
    const dealer = await getDealerProfile(req.user.userId)

    return res.status(200).json({ dealer })
  } catch (error: any) {
    next(error)
  }
}

// Controller to update the logged-in dealer's profile
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Check if user exists in request (set by JWT middleware)
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const updates = req.body
    // Update dealer profile using service
    const updatedDealer = await updateDealerProfile(req.user.userId, updates)

    return res.status(200).json({ dealer: updatedDealer })
  } catch (error: any) {
    next(error)
  }
}


export const  createCar= async (
  req: Request,
  res: Response,
  next: NextFunction,
) : Promise<void> => {
  try {
 

    const dealerId = req.user?.userId

    if (!dealerId) {
      throw new Error('Dealer ID not found in token')
    }
      const payload = createCarSchema.parse(req.body)

    const car = await createCarsService({
      dealer: new Types.ObjectId(dealerId),
      ...payload,
    }) 

    res.status(201).json(car)
  } catch (err) {
    next(err)
  }
}
export const updateCar= async (
  req: Request,
  res: Response,
  next: NextFunction,
)=> {
  try {
    const { carId } = req.params
    const dealerId = req.user?.userId

    if (!dealerId) {
      throw new Error('Dealer ID not found in token')
    }

    if (!Types.ObjectId.isValid(carId)) {
      throw new Error('Invalid car ID')
    }

    const payload = updateCarSchema.parse(req.body)

    const updatedCar = await updateCarService(
        carId,
      payload,
    )

    if (!updatedCar) {
      return res.status(404).json({ message: 'Car not found' })
    }

    res.json(updatedCar)
  } catch (err) {
    next(err)
  }
}
export const deleteCar= async (
  req: Request,
  res: Response,
  next: NextFunction,
)=> {
  try {
    const { carId } = req.params
    const dealerId = req.user?.userId

    if (!dealerId) {
      throw new Error('Dealer ID not found in token')
    }

    if (!Types.ObjectId.isValid(carId)) {
      throw new Error('Invalid car ID')
    }

    const deletedCar = await deleteCarService(
      carId
    )

    if (!deletedCar) {
      throw new Error('Car not found')
    }

    res.json(deletedCar)
  } catch (err) {
    next(err) 
    }
    }

export const createSlot = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { carId } = req.params
    const dealerId = req.user?.userId
    const { startTime, endTime } = req.body

    if (!dealerId) {
      throw new Error('Dealer ID not found in token')
    }

    if (!Types.ObjectId.isValid(carId)) {
      throw new Error('Invalid car ID')
    }

    const slot = await createSlotService({
      car: carId,
      dealer: dealerId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    })

    res.status(201).json(slot)
  } catch (err) {
    next(err)
  }
}