/* eslint-disable max-params */
/**
 * Defines the order router.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

import express from 'express'
import { isAuthorized } from '../../../utils/auth.js'
import { OrderController } from '../../../controllers/OrderController.js'

export const router = express.Router()

const orderController = new OrderController()

// Provide req.doc to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => orderController.loadItem(req, res, next, id))

// Map HTTP verbs and route paths to controller action methods.
router.get('/',  
  isAuthorized,
  (req, res, next) => orderController.getOrdersByUserId(req, res, next))
router.get('/:id',  
  isAuthorized, 
  // isAuctorized,
  (req, res, next) => orderController.getOrderById(req, res, next))
router.post('/', 
  isAuthorized,
  (req, res, next) => orderController.createOrder(req, res, next)) 
router.delete('/:id',  
  isAuthorized, 
  // isAuctorized,
  (req, res, next) => orderController.deleteOrder(req, res, next)) 
