/**
 * Defines the cart controller.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

import { CartModel } from '../models/CartModel.js'
import { BookShopService } from '../services/BookShopService.js' 

export class CartController {
  #cartModel = new CartModel()

  // GET /api/v1/cart/
  async getCartByUserId(req, res, next) {
    try {
      const cart = await this.#cartModel.getCartByUserId(req.session.user.userId)

      const bookShopService = new BookShopService()
      
      for (const item of cart) {
        await bookShopService.addTitleAndPrice(item)
      }

      res.json(cart)
    } catch (error) {
      next(error)
    }
  }

  // POST /api/v1/cart
  async saveToCart(req, res, next) {
    try {
      const { isbn, quantity } = req.body
      await this.#cartModel.saveToCart({
        userId: req.session.user.userId,
        isbn,
        quantity,
      })

      res
        .status(201)
        .json({ 
          message: 'Cart saved.',
        })
    } catch (error) {
      next(error)
    }
  }

  // DELETE /api/v1/cart
  async deleteCart(req, res, next) {
    try {
      await this.#cartModel.deleteCart(req.session.user.userId)
      
      res
        .status(204)
        .json({ 
          message: 'Cart deleted.'
        })
    } catch (error) {
      next(error)
    }
  }
}
