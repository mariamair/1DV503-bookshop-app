/**
 * The starting point of the backend application.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

import express from 'express'
import session from 'express-session'
import { sessionOptions } from './utils/sessionOptions.js'
import helmet from 'helmet'
import cors from 'cors'
import { router } from './routes/router.js'
import { ErrorHandler } from './utils/ErrorHandler.js'
import { pool } from './utils/database.js'

pool.getConnection()
  .then(() => console.log('Database connected successfully'))
  .catch((error) => {
    console.error('Database connection failed:', error)
    process.exit(1)
  })

const app = express()

app.use(helmet())
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      // eslint-disable-next-line quotes
      'script-src': ["'self'"]
    }
  })
)

// Enable Cross Origin Resource Sharing (CORS)
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true // Allow credentials
}))

// Parse incoming requests of content type 'application/x-www-form-urlencoded'.
app.use(express.urlencoded({ extended: false }))

// Parse incoming requests of content type 'application/json'.
app.use(express.json())

app.use(session(sessionOptions))

app.use('/', router)

// Global error handling middleware (must be last)
app.use(ErrorHandler.handle)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}. \nIn Dev environment use http://localhost:${PORT}`)
  console.log('Press Ctrl + C to terminate application')
})
