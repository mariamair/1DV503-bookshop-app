/**
 * Defines helper methods and business logic for the book shop.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

import { BookModel } from '../models/BookModel.js'
import { CartModel } from '../models/CartModel.js'
import { UserModel } from '../models/UserModel.js'

export class BookShopService {

  // When cart is requested, add title and price for each book.
  async addTitleAndPrice(item) {
    const bookModel = new BookModel()
    const book = await bookModel.getBookById(item.isbn)
    item.title = book.title
    item.price = book.price
    return item
  }

  // When order is requested, compile order details from cart and user, and delete cart.
  async getOrderInformation(userId) {
    
    // Get current date and format it as YYYY-MM-DD
    const now = new Date()
    const dateString = now.toISOString().split('T')[0]

    const books = []
    const cartModel = new CartModel()
    const cart = await cartModel.getCartByUserId(userId)

    for (const item of cart) {
      const amount = await this.#getPrice(item.isbn) * item.qty
      books.push({ isbn: item.isbn, qty: item.qty, amount })
    }

    const userModel = new UserModel()
    const user = await userModel.getUserById(userId)

    // Delete cart information for user
    await cartModel.deleteCart(userId)

    return {
      userId,
      createdDate: dateString,
      address: user.address,
      city: user.city,
      zip: user.zip,
      books
    }
  }

  async #getPrice(isbn) {
    const bookModel = new BookModel()
    const book = await bookModel.getBookById(isbn)
    return book.price
  }
}
