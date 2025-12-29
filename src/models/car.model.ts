import mongoose from 'mongoose'
import { InferSchemaType } from 'mongoose'

const CarSchema = new mongoose.Schema(
  {
    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    price: Number,

    images: { type: [String], default: [] },

    specs: {
      engine: String,
      transmission: String,
      fuelType: String,
      horsepower: Number,
      color: String,
      acceleration: Number,
      torque: Number,
      drivetrain: String,
      cartype: String,
    },

    isActive: { type: Boolean, default: true },
    features: { type: [String], default: [] },
  },
  { timestamps: true },
)
export type CarDocument = InferSchemaType<typeof CarSchema>
export const Car = mongoose.model('Car', CarSchema)
