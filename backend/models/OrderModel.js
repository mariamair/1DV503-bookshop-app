/**
 * Defines the order model.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

import { pool } from '../utils/database.js'
import { DatabaseError, NotFoundError, UnauthorizedError, ValidationError } from '../utils/ErrorHandler.js'

export class OrderModel {
  async getOrderById(orderId, userId) {
    try {
      this.#validateUser(userId)
      this.#validateOrderNumber(orderId)

      const query = 'SELECT o.*, DATE_ADD(o.created, INTERVAL 7 DAY) AS deliveryDate, m.fname, m.lname' 
        + ' FROM orders o'
        + ' JOIN members m ON o.userid = m.userid'
        + ' WHERE o.ono = ? AND o.userid = ?'

      const [results] = await pool.query(query,[orderId, userId])

      if (results.length === 0) {
        throw new NotFoundError('Item not found.')
      }

      return results[0]

    } catch (error) {
      // Rethrow expected errors as-is. Wrap all other errors as database errors.
      if (error instanceof ValidationError 
        || error instanceof UnauthorizedError 
        || error instanceof NotFoundError) {
        throw error
      } else {
        throw new DatabaseError(error.message)
      }
    }
  }

  async getOrders(userId) {
    try {
      this.#validateUser(userId)

      const query = 'SELECT * FROM orders WHERE userid = ?'
      const [results] = await pool.query(query,[userId])

      if (results.length === 0) {
        throw new NotFoundError('Items not found.')
      }

      return results

    } catch (error) {
      // Rethrow expected errors as-is. Wrap all other errors as database errors.
      if (error instanceof UnauthorizedError 
        || error instanceof NotFoundError) {
        throw error
      } else {
        throw new DatabaseError(error.message)
      }
    }
  }

  async createOrder(orderInformation) {
    try {
      this.#validateUser(orderInformation.userId)
      this.#validateOrderInformation(orderInformation)

      const query = 'INSERT INTO orders (userid, created, shipAddress, shipCity, shipZip)' 
      + ' VALUES (?, ?, ?, ?, ?)'
    
      const values = [
        orderInformation.userId, 
        orderInformation.createdDate, 
        orderInformation.address, 
        orderInformation.city, 
        orderInformation.zip, 
      ]
  
      const [results] = await pool.query(query, values)
      
      for (const book of orderInformation.books) {
        await this.#createOrderDetails(book, results.insertId)
      }

      return results.insertId

    } catch (error) {
      // Rethrow expected errors as-is. Wrap all other errors as database errors.
      if (error instanceof ValidationError 
        || error instanceof UnauthorizedError) {
        throw error
      } else {
        throw new DatabaseError(error.message)
      }
    }
  }
  
  async #createOrderDetails(book, orderNumber) {
    try {
      this.#validateOrderNumber(orderNumber)
      this.#validateOrderDetailInformation(book)
      const query = 'INSERT INTO odetails (ono, isbn, qty, amount)'
        + ' VALUES (?, ?, ?, ?)'
  
      const values = [
        orderNumber,
        book.isbn,
        book.qty,
        book.amount,
      ]
  
      const [results] = await pool.query(query, values)
      return results.insertId
    } catch (error) {
      // Rethrow expected errors as-is. Wrap all other errors as database errors.
      if (error instanceof ValidationError) {
        throw error
      } else {
        throw new DatabaseError(error.message)
      }
    }
  }

  async deleteOrder(orderInformation) {
    try {
      this.#validateUser(orderInformation.userId)
      this.#validateOrderNumber(orderInformation.orderId)

      const orderDetailQuery = 'DELETE FROM odetails WHERE ono = ?'

      // Delete order details before deleting order
      await pool.query(orderDetailQuery, [orderInformation.orderId])

      const orderQuery = 'DELETE FROM orders WHERE userid = ? AND ono = ?'
      
      const values = [
        orderInformation.userId, 
        orderInformation.orderId,
      ]

      await pool.query(orderQuery, values)

    } catch (error) {
      // Rethrow expected errors as-is. Wrap all other errors as database errors.
      if (error instanceof ValidationError 
        || error instanceof UnauthorizedError) {
        throw error
      } else {
        throw new DatabaseError(error.message)
      }
    }
  }

  #validateUser(userId) {
    if (!userId) {
      throw new UnauthorizedError('User not authorized.')
    }
  }

  #validateOrderNumber(orderId) {
    if (!orderId) {
      throw new ValidationError('Order number is required.')
    }
  }

  #validateOrderInformation(orderInformation) {
    const required = ['createdDate', 'address', 'city', 'zip', 'books']

    if (!required.every(prop => prop in orderInformation)) {
      throw new ValidationError('Incomplete order information.')
    }
  }

  #validateOrderDetailInformation(book) {
    const required = ['isbn', 'qty', 'amount']

    if (!required.every(prop => prop in book)) {
      throw new ValidationError('Incomplete order details.')
    }
  }
}
