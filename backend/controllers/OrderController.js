/**
 * Defines the order controller.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

import { OrderModel } from '../models/OrderModel.js'
import { BookShopService } from '../services/BookShopService.js' 

export class OrderController {
  #orderModel = new OrderModel()

  // eslint-disable-next-line max-params
  async loadItem(req, res, next, id) {
    try {
      const order = await this.#orderModel.getOrderById(id, req.session.user.userId)
    
      // Provide the item to req.doc
      req.doc = order
    
      // Next middleware.
      next()
    } catch (error) {
      next(error)
    }
  }

  // GET /api/v1/orders/:id
  async getOrderById(req, res, next) {
    try {
      const order = req.doc
      res.json(order)
    } catch (error) {
      next(error)
    }
  }

  // GET /api/v1/orders
  async getOrders(req, res, next) {
    try {
      const orders = await this.#orderModel.getOrders(req.session.user.userId)
      res.json(orders)
    } catch (error) {
      next(error)
    }
  }

  // POST /api/v1/orders
  async createOrder(req, res, next) {
    try {
      const userId = req.session.user.userId

      const bookShopService = new BookShopService()
      const orderInformation = await bookShopService.getOrderInformation(userId)
      
      const orderNumber = await this.#orderModel.createOrder(orderInformation)

      res
        .status(201)
        .json({ 
          message: 'Order created',
          orderNumber
        })
    } catch (error) {
      next(error)
    }
  }

  // DELETE /api/v1/orders/:id
  async deleteOrder(req, res, next) {
    try {
      await this.#orderModel.deleteOrder({
        userId: req.session.user.userId,
        orderId: req.doc.id
      })
      
      res
        .status(204)
        .json({ 
          message: 'Order deleted'
        })
    } catch (error) {
      next(error)
    }
  }
}
