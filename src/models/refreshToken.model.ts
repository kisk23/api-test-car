import { Schema, model, Document, Types } from 'mongoose'


export interface RefreshTokenDocument extends Document {
  user: Types.ObjectId
  token: string
  expiresAt: Date
}

const RefreshTokenSchema = new Schema<RefreshTokenDocument>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
})

export const RefreshToken = model<RefreshTokenDocument>(
  'RefreshToken',
  RefreshTokenSchema,
)
