/**
 * Defines the book model.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

import { pool } from '../utils/database.js'
import { ValidationError, DatabaseError, NotFoundError } from '../utils/ErrorHandler.js'

export class BookModel {

  async getBookById(id) {
    try {
      if (!id) {
        throw new ValidationError('ISBN is required.')
      }

      const query = 'SELECT * FROM books WHERE isbn = ?'
      const [results] = await pool.query(query,[id])

      if (results.length === 0) {
        throw new NotFoundError('Item not found.')
      }

      return results[0]

    } catch (error) {
      // Rethrow expected errors as-is. Wrap all other errors as database errors.
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error
      } else {
        throw new DatabaseError(error.message)
      }
    }
  }

  async getBooksByAllSearchParams(params) {
    try {
      if (!params.subject) {
        throw new ValidationError('Subject is required.')
      }

      let query = 'FROM books WHERE subject = ? '
      const values = [params.subject]

      if (params.author) {
        query += 'AND author LIKE ?'
        values.push(params.author + '%')
      }

      if (params.title) {
        query += 'AND title LIKE ?'
        values.push('%' + params.title + '%')
      }

      const [rows] = await pool.query(`SELECT COUNT(*) AS rowCount ${query}`, values)

      query += ' LIMIT ? OFFSET ?'
      values.push(this.#setLimit(params.limit))
      values.push(this.#setOffset(params.offset))
    
      const [results] = await pool.query(`SELECT * ${query}`, values)

      if (results.length === 0) {
        throw new NotFoundError('Items not found.')
      }
      
      return { results, rowCount: rows[0].rowCount }
    } catch (error) {
      // Rethrow expected errors as-is. Wrap all other errors as database errors.
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error
      } else {
        throw new DatabaseError(error.message)
      }
    }
  }

  async getBooksBySubject(params) {
    try {
      if (!params.subject) {
        throw new ValidationError('Subject is required.')
      }

      const values = [params.subject]
      let query = 'FROM books WHERE subject = ?'

      const [rows] = await pool.query(`SELECT COUNT(*) AS rowCount ${query}`, values)
      
      query += ' LIMIT ? OFFSET ?'
      values.push(this.#setLimit(params.limit))
      values.push(this.#setOffset(params.offset))

      const [results] = await pool.query(`SELECT * ${query}`, values)

      if (results.length === 0) {
        throw new NotFoundError('Items not found.')
      }
      
      return { results, rowCount: rows[0].rowCount }
    } catch (error) {
      // Rethrow expected errors as-is. Wrap all other errors as database errors.
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error
      } else {
        throw new DatabaseError(error.message)
      }
    }
  }

  async getBooksByAuthorOrTitle(params) {
    try {
      if (!params.author && !params.title) {
        throw new ValidationError('Author or Title is required.')
      }

      let query = 'FROM books WHERE '
      const values = []

      if (params.author) {
        query += 'author LIKE ?'
        values.push(params.author + '%')
      }

      if (params.author && params.title) {
        query += ' AND '
      }

      if (params.title) {
        query += 'title LIKE ?'
        values.push('%' + params.title + '%')
      }

      const [rows] = await pool.query(`SELECT COUNT(*) AS rowCount ${query}`, values)

      query += ' LIMIT ? OFFSET ?'
      values.push(this.#setLimit(params.limit))
      values.push(this.#setOffset(params.offset))
    
      const [results] = await pool.query(`SELECT * ${query}`, values)

      if (results.length === 0) {
        throw new NotFoundError('Items not found.')
      }
      
      return { results, rowCount: rows[0].rowCount }
    } catch (error) {
      // Rethrow expected errors as-is. Wrap all other errors as database errors.
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error
      } else {
        throw new DatabaseError(error.message)
      }
    }
  }

  async getAllSubjects() {
    try {
      const query = 'SELECT DISTINCT subject FROM books ORDER BY subject'
      const [results] = await pool.query(query)
      
      if (results.length === 0) {
        throw new NotFoundError('Items not found.')
      }
      
      return results
    } catch (error) {
      // Rethrow expected errors as-is. Wrap all other errors as database errors.
      if (error instanceof NotFoundError) {
        throw error
      } else {
        throw new DatabaseError(error.message)
      }
    }
  }

  #setLimit(limit) {
    return limit ? parseInt(limit) : 5
  }

  #setOffset(offset) {
    return offset ? parseInt(offset) : 0
  }
}
