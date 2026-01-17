/**
 * Defines the user controller.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

import { UserModel } from '../models/UserModel.js'

export class UserController {
  #userModel = new UserModel()

  // eslint-disable-next-line max-params
  async loadItem(req, res, next, id) {
    try {
      const user = await this.#userModel.getUserById(id)

      // Provide the item to req.doc
      req.doc = user

      // Next middleware.
      next()
    } catch (error) {
      next(error)
    }
  }

  // GET /api/v1/users/:id
  async getUserById(req, res, next) {
    try {
      res.json(req.doc)
    } catch (error) {
      next(error)
    }
  }

  // POST /api/v1/users/register
  async createUser(req, res, next) {
    try {
      const { firstName, lastName, address, city, zip, phone, email, password } = req.body

      await this.#userModel.createUser({
        firstName, 
        lastName, 
        address, 
        city, 
        zip, 
        phone, 
        email, 
        password
      })

      res
        .status(201)
        .json('Registration successful.')
    } catch (error) {
      next(error)
    }
  }

  // POST /api/v1/users/login
  async login (req, res, next) {
    try {
      const { email, password } = req.body
      const user = await this.#userModel.authenticateUser(email, password)

      // Regenerate session (Security best practice) 
      req.session.regenerate((error) => {
        if (error) {
          throw new Error('Failed to re-generate session.')
        }

        // Store the authenticated user in the session store.
        req.session.user = { userId: user.userid }
      
        res
          .status(200)
          .json({
            userId: user.userid,
            firstName: user.firstName
          })
      })
    } catch (error) {
      next(error)
    }
  }

  // GET /api/v1/users/logout
  async logout (req, res) {
    try {
      req.session.destroy()
      res.status(200).json({ message: 'Logged out successfully.' })
    } catch (error) {
      // Still consider it a successful logout from user perspective. They are disconnected even if the cleanup failed.
      res.status(200).json({ message: 'Logged out.' })
      
      // Log the error for debugging
      throw new Error(`Session destroy failed: ${error.message}`)
    }
  }
}
