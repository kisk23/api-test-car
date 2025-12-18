
import { Types } from "mongoose";
export interface ListCarsParams {
  brand?: string;
  model?: string;
  year?: number;
  dealerId?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
export interface CarFilter {
  isActive?: boolean;
  brand?: RegExp;
  model?: RegExp;
  year?: number;
  dealer?: Types.ObjectId;
}