import { Router } from 'express'
import {
  registerController,
  signInController,
} from '../controllers/register.controller'
import refreshTokenController from '../controllers/refresh.controller'
import {
  createDealerSchema,
  createUserSchema,
  loginSchema,
} from '../validations/user.schema'
import { validate } from '../middlewares/validate'

const router = Router()

// Customer register
router.post(
  '/register/customer',
  validate(createUserSchema),
  (req, res, next) => {
    req.body.role = 'customer'
    return registerController(req, res, next)
  },
)

// Dealer register
router.post(
  '/register/dealer',
  validate(createDealerSchema),
  (req, res, next) => {
    req.body.role = 'dealer'
    return registerController(req, res, next)
  },
)
// Admin register
router.post('/register/admin', (req, res, next) => {
  req.body.role = 'admin'
  return registerController(req, res, next)
})

// Login
router.post('/login', validate(loginSchema), signInController)

// Refresh token
router.post('/refresh', refreshTokenController)

export default router
