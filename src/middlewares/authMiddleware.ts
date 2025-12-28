import { Request, Response, NextFunction,} from 'express'
import jwt from 'jsonwebtoken'
export type UserRole = "customer" | "dealer" | "admin";
export interface JwtPayload {
  userId: string
  email: string
  role: 'user' | 'admin' | 'dealer'
  iat?: number
  exp?: number
}
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // Try to get token from cookie first, then from Authorization header
  let token = req.cookies?.token;
  
  // If no cookie, check Authorization header
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return unauthorized(res, 'No authentication token provided');
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload

    req.user = decoded
    next()
  } catch (err: Error | any) {
    return res.status(401).json({error: err, message: 'Invalid or expired token' })
  }
}
function unauthorized(res: Response, msg = "Unauthorized") {
  return res.status(401).json({ message: msg });
}
 export const requireRole = (expected: UserRole | UserRole[]) => {
  const allowed = Array.isArray(expected) ? expected : [expected];
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !("role" in req.user)) return unauthorized(res);
    if (!allowed.includes((req.user as any).role)) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }
    next();
  };
};