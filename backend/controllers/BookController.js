/**
 * Defines the book controller.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

import { BookModel } from '../models/BookModel.js'
import { ValidationError } from '../utils/ErrorHandler.js'

export class BookController {
  #bookModel = new BookModel()

  // eslint-disable-next-line max-params
  async loadItem(req, res, next, id) {
    try {
      const book = await this.#bookModel.getBookById(id)
    
      // Provide the item to req.doc
      req.doc = book
    
      // Next middleware.
      next()
    } catch (error) {
      next(error)
    }
  }

  // GET /api/v1/books/:id
  async getBookById(req, res, next) {
    try {
      res.json(req.doc)
    } catch (error) {
      next(error)
    }
  }

  // GET /api/v1/books
  async getBooksBySearchParams(req, res, next) {
    try {
      if (Object.keys(req.query).length === 0) {
        throw new ValidationError('Query parameters are required.')
      }
      const { subject, author, title, limit, offset } = req.query

      let books

      if (!subject) {
        books = await this.#bookModel.getBooksByAuthorOrTitle({
          author,
          title,
          limit,
          offset
        })
      } else if (subject && !author && !title) {
        books = await this.#bookModel.getBooksBySubject({
          subject,
          limit,
          offset
        })
      } else {
        books = await this.#bookModel.getBooksByAllSearchParams({
          subject,
          author,
          title,
          limit,
          offset
        })
      }

      res.json(books)
    } catch (error) {
      next(error)
    }
  }

  // GET /api/v1/books/subjects
  async getSubjects(req, res, next) {
    try {
      const subjects = await this.#bookModel.getAllSubjects()
      res.json(subjects)
    } catch (error) {
      next(error)
    }
  }
}
