/**
 * Defines the cart model.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

import { pool } from '../utils/database.js'
import { DatabaseError, UnauthorizedError, ValidationError } from '../utils/ErrorHandler.js'

export class CartModel {
  async getCartByUserId(userId, isbn) {
    try {
      this.#validateUser(userId)

      let query = 'SELECT * FROM cart WHERE userid = ?'
      const values = [userId]

      if (isbn) {
        query += ' AND isbn = ?'
        values.push(isbn)
      }
 
      const [results] = await pool.query(query, values)

      return results

    } catch (error) {
      // Rethrow expected errors as-is. Wrap all other errors as database errors.
      if (error instanceof ValidationError 
        || error instanceof UnauthorizedError ) {
        throw error
      } else {
        throw new DatabaseError(error.message)
      }
    }
  }

  async saveToCart(details) {
    try {
      let result 
      let existingRow = await this.getCartByUserId(details.userId, details.isbn)
      if (existingRow.length > 0) {
        details.quantity += existingRow[0].qty
        result = this.updateCart(details)
      } else {
        result = this.#saveNewRow(details)
      }

      return result
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

  async #saveNewRow(details) {
    try {
      this.#validateUser(details.userId)
      this.#validateCartInformation(details)

      const query = 'INSERT INTO cart (userid, isbn, qty)' 
      + ' VALUES (?, ?, ?)'
    
      const values = [
        details.userId, 
        details.isbn, 
        details.quantity, 
      ]
  
      const [results] = await pool.query(query, values)

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

  async updateCart(details) {
    try {
      this.#validateUser(details.userId)
      this.#validateCartInformation(details)

      const query = 'UPDATE cart SET qty = ? WHERE userid = ? AND isbn = ?'
  
      const values = [
        details.quantity,
        details.userId, 
        details.isbn,
      ]
  
      const [results] = await pool.query(query, values)
      return results

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

  async deleteCart(userId) {
    try {
      this.#validateUser(userId)

      const query = 'DELETE FROM cart WHERE userid = ?'

      await pool.query(query, [userId])

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

  #validateCartInformation(details) {
    const required = ['isbn', 'quantity']

    if (!required.every(prop => prop in details)) {
      throw new ValidationError('Incomplete information.')
    }
  }
}
