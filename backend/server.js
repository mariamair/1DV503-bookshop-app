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

const connectWithRetry = async (retries = 10, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.getConnection()
      console.log('Database connected successfully')
      return
    } catch (error) {
      console.error(`DB connection failed (attempt ${i + 1}/${retries})`)
      console.error(error.address + ':' + error.port)
      if (i === retries - 1) {
        console.error('Giving up. Exiting.')
        process.exit(1)
      }
      await new Promise(res => setTimeout(res, delay))
    }
  }
}

await connectWithRetry()


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
