import express from 'express'

import { connectDB } from './configs/db'
import { errorHandler } from './middlewares/error.handling'
import authRoutes from './routes/auth.route'

import cookieParser from 'cookie-parser'

import customerRoutes from './routes/customer.route'
import dealerRoutes from './routes/dealer.route'

process.loadEnvFile('.env')

const app = express()
const PORT = process.env.PORT || 4000
import cors from 'cors'
app.use(cors())
app.use(cookieParser())

app.use(express.json())

app.use('/auth', authRoutes)
app.use('/customer', customerRoutes)
app.use('/dealer', dealerRoutes)

import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './swagger.json'

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(errorHandler)
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`API running at http://localhost:${PORT}`)
  })
})

// app.get('/v1/kit-stats', (req, res) => {
//   res.json({ fkUsers: 123, hsaUsers: 45 });
// });

// app.listen(3001, () => console.log('Mock KIT -> http://localhost:3001/v1/kit-stats'));
