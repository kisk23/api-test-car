import { Request, Response, NextFunction } from 'express'
import { signUp, signIn } from '../services/auth.service'
import { UserDocument } from '../models/cusrtomer.model'

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      email,
      password,
      name,
      role,
      phone,
      dealershipName,
      dealershipLocation,
    } = req.body

    if (!['customer', 'dealer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' })
    }

    if (role === 'dealer') {
      if (!dealershipName || !dealershipLocation) {
        return res.status(400).json({
          message:
            'dealershipName and dealershipLocation are required for dealer',
        })
      }
    } else {
      delete req.body.dealershipName
      delete req.body.dealershipLocation
    }

    const { user, accessToken, refreshToken } = await signUp({
      email,
      password,
      name,
      role,
      phone,
      dealershipName,
      dealershipLocation,
    } as UserDocument)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    })

    return res.status(201).json({ user, accessToken })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
    return next(error)
  }
}

export const signInController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body
    const { user, accessToken, refreshToken } = await signIn(email, password)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    })
    return res.status(200).json({ user, accessToken })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
    return next(error)
  }
}

export default { registerController, signInController }
