import { Request, Response, NextFunction } from 'express'
import { refreshAccessToken } from '../services/auth.service'
export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // read from cookie OR body (if you want mobile clients)
    const REFRESH_COOKIE_NAME =
      process.env.REFRESH_COOKIE_NAME || 'refreshToken'
    const tokenFromCookie = req.cookies?.[REFRESH_COOKIE_NAME]
    const tokenFromBody = req.body?.refreshToken
    const refreshToken = tokenFromCookie || tokenFromBody

    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' })
    }

    const { user, accessToken } = await refreshAccessToken(refreshToken)
    return res.status(200).json({ user, accessToken })
  } catch (error: any) {
    res.status(401).json({ message: error.message })
    return next(error)
  }
}

export default refreshTokenController
