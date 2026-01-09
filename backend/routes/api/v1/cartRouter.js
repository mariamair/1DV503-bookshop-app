/**
 * Defines the cart router.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

import express from 'express'
import { isAuthorized } from '../../../utils/auth.js'
import { CartController } from '../../../controllers/CartController.js'

export const router = express.Router()

const cartController = new CartController()

// Map HTTP verbs and route paths to controller action methods.
router.get('/',  
  isAuthorized,
  (req, res, next) => cartController.getCartByUserId(req, res, next))
router.post('/', 
  isAuthorized,
  (req, res, next) => cartController.saveToCart(req, res, next)) 
router.delete('/',  
  isAuthorized,
  (req, res, next) => cartController.deleteCart(req, res, next)) 
