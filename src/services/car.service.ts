import { Car, CarDocument } from '../models/car.model'
import { ListCarsParams, PaginatedResult, CarFilter } from '../types/car'
import { listCarsSchema } from '../validations/carFilter.schema'

/*
 HTTP Request
   ↓
Controller
   ↓
listCarsForCustomers()
   ↓
Sanitize inputs
   ↓
Build filter object
   ↓
MongoDB query + count (parallel)
   ↓
Pagination metadata
   ↓
HTTP Response */

//TYPES

export const listCarsForCustomers = async (
  rawParams: Partial<ListCarsParams>,
): Promise<PaginatedResult<Partial<CarDocument>>> => {
  const { brand, model, year, dealerId, page, limit } =
    listCarsSchema.parse(rawParams)

  const skip = (page - 1) * limit

  const filter: CarFilter = {
    isActive: true, //to be updated if we want to reuten all cars
  }

  if (brand) {
    filter.brand = brand // RegExp (from Zod)
  }

  if (model) {
    filter.model = model // RegExp
  }

  if (year) {
    filter.year = year // number
  }

  if (dealerId) {
    filter.dealer = dealerId // ObjectId (from Zod)
  }

  const [cars, total] = await Promise.all([
    Car.find(filter)
      .select(
        '_id brand model year price images specs features dealer createdAt',
      )
      .populate('dealer', 'name dealershipName dealershipLocation')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Car.countDocuments(filter),
  ])

  const totalPages = total > 0 ? Math.ceil(total / limit) : 1

  return {
    data: cars,
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}

export const getCarById = async (id: string) => {
  return await Car.findById(id)
    .populate('dealer', 'name dealershipName dealershipLocation')
    .lean()
}
