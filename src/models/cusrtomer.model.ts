import { model, Schema } from 'mongoose'
import { InferSchemaType } from 'mongoose'

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ['customer', 'dealer', 'admin'],
      required: true,
    },

    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }, // soft-block account
    deletedAt: { type: Date, default: null },

    // dealer-specific
    dealershipName: { type: String },
    dealershipLocation: { type: String },
  },
  { timestamps: true },
)

export type UserDocument = InferSchemaType<typeof UserSchema>

export const User = model('User', UserSchema)
