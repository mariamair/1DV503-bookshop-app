/**
 * Defines the main router.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

import express from 'express'
import { router as bookRouter } from './api/v1/bookRouter.js'
import { router as cartRouter } from './api/v1/cartRouter.js'
import { router as orderRouter } from './api/v1/orderRouter.js'
import { router as userRouter } from './api/v1/userRouter.js'

export const router = express.Router()

// Serve training and statistic routes
router.get('/', (req, res) => res.json({ 
  message: 'Current API versions', 
  versions: [ { number: 'Version 1', route: '/api/v1' }]
}))
router.get('/api/v1', (req, res) => res.json({ message: 'Welcome to version 1 of this RESTful API!' }))
router.use('/api/v1/books', bookRouter)
router.use('/api/v1/users', userRouter)
router.use('/api/v1/cart', cartRouter)
router.use('/api/v1/orders', orderRouter)
