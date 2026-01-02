import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'

import { connectDB } from './configs/db'
import { errorHandler } from './middlewares/error.handling'

import authRoutes from './routes/auth.route'
import customerRoutes from './routes/customer.route'
import dealerRoutes from './routes/dealer.route'

import swaggerDocument from './swagger.json'

// ✅ Load .env ONLY in local / non-production
if (process.env.NODE_ENV !== 'production') {
 process.loadEnvFile('.env')
}

const app = express()
const PORT = Number(process.env.PORT) || 4000


const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? [process.env.CLIENT_URL!]
    : ['http://localhost:3000', 'http://localhost:5000']

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
)

app.use(cookieParser())
app.use(express.json())

// Serve static files
app.use(express.static('public'))

// Routes
app.use('/auth', authRoutes)
app.use('/customer', customerRoutes)
app.use('/dealer', dealerRoutes)

// Healthcheck (good for Railway)
app.get('/health', (_req, res) => {
  res.status(200).send('OK')
})

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Error handler (last)
app.use(errorHandler)

// Start server only after DB connects
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Failed to connect to DB:', err)
    process.exit(1)
  })

