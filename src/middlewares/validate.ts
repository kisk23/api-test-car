import { ZodError } from 'zod'
import { Request, Response, NextFunction } from 'express'
// Middleware to validate request data against a Zod schema
export const validate =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      })

      if (parsed.body) req.body = parsed.body
      if (parsed.query) req.query = parsed.query
      if (parsed.params) req.params = parsed.params

      return next()
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.issues.map((issue) => ({
          message: issue.message,
        }))
        return res.status(400).json({ errors })
      }

      return next(err)
    }
  }
