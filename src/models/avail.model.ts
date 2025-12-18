import mongoose from 'mongoose'

const AvailabilitySchema = new mongoose.Schema(
  {
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },

    isBooked: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export const Availability = mongoose.model('Availability', AvailabilitySchema)
