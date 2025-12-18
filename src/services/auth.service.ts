import { User } from '../models/cusrtomer.model'
import argon2 from 'argon2'
import { UserDocument } from '../models/cusrtomer.model'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { RefreshToken } from '../models/refreshToken.model'
import { PopulatedRefreshToken } from '../types/refreshToken'
import { hashPassword, verifyPassword } from '../utils/helpers'
import { Types } from 'mongoose'

const createRefreshToken = async (userId: string) => {
  const token = crypto.randomBytes(40).toString('hex')
  const REFRESH_EXPIRES_DAYS = process.env.REFRESH_EXPIRES_DAYS
    ? parseInt(process.env.REFRESH_EXPIRES_DAYS)
    : 14
  const expiresAt = new Date(
    Date.now() + REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
  )

  await RefreshToken.create({
    user: userId,
    token: token,
    expiresAt,
  })
  return token
}

const signUp = async ({
  email,
  password,
  name,
  role,
  phone,
  dealershipName,
  dealershipLocation,
}: UserDocument) => {
  // i had here two aptions 1 to hit the db twice 2 to catch the error from mongo db and i went for the second one
  // performance wise its better to hit the db once

  const existingUser = await User.findOne({
    email,
  })

  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error('Email already exists')
    }
  }

  try {
    const hashedPassword = await hashPassword(password)
    const user = await User.create({
      email,
      name,
      password: hashedPassword,
      role,
      phone,
      dealershipName,
      dealershipLocation,
    })
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables')
    }
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    )
    const refreshToken = await createRefreshToken(user._id.toString())
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user.toObject()
    return { user: userWithoutPassword, accessToken, refreshToken }
  } catch (error: any) {
    if (error.code === 11000 && error.keyValue) {
      const field = Object.keys(error.keyValue)[0]
      throw new Error(`${field} already exists`)
    }
    throw error
  }
}

const signIn = async (email: string, password: string) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('Invalid email or password')
  }
  const validPassword = await argon2.verify(user.password, password)
  if (!validPassword) {
    throw new Error('Invalid email or password')
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables')
  }
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  )
  const refreshToken = await createRefreshToken(user._id.toString())
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user.toObject()
  return { user: userWithoutPassword, accessToken, refreshToken }
}

const refreshAccessToken = async (refreshToken: string) => {
  //   lean() = Return raw objects. Faster. Simpler. No Mongoose document behavior.
  // For your use-case, it's the right choice.
  const storedToken = await RefreshToken.findOne({})
    .populate('user')
    .lean<PopulatedRefreshToken>()
    .where('token')
    .equals(refreshToken)

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new Error('Invalid or expired refresh token')
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables')
  }

  const accessToken = jwt.sign(
    { userId: storedToken.user._id, role: storedToken.user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  )
  return { user: storedToken.user, accessToken }
}
const changePassword = async (
  userId: Types.ObjectId,
  current: string,
  next: string,
) => {
  const user = await User.findById(userId).select('+password')
  if (!user) throw new Error('User not found')
  const ok = await verifyPassword(current, user.password)
  if (!ok) throw new Error('Current password incorrect')
  user.password = await hashPassword(next)
  await user.save()

  return true
}

export { signUp, signIn, refreshAccessToken, changePassword }
