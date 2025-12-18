import { Request, Response, NextFunction } from 'express'

interface AppError extends Error {
  status?: number
  statusCode?: number
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // If a previous middleware already started sending a response,
  // delegate to Express' default handler.
  if (res.headersSent) {
    return next(err)
  }

  console.error(err)

  const status =
    typeof err.statusCode === 'number'
      ? err.statusCode
      : typeof err.status === 'number'
        ? err.status
        : 500

  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
    }),
  })
}
