import { Types } from 'mongoose'
import { UserDocument } from '../models/cusrtomer.model'
export interface PopulatedRefreshToken {
  _id: Types.ObjectId
  user: UserDocument & { _id: Types.ObjectId }
  token: string
  expiresAt: Date
}
