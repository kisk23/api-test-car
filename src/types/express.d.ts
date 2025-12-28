import { JwtPayload } from './middleware/authmidlleware'

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
      
    }
  }
}

export {}
