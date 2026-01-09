/**
 * Handles authentication and authorization.
 *
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

import { UnauthorizedError } from './ErrorHandler.js'

/**
 * Check if the user is logged in.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export async function isAuthorized (req, res, next) {
  try {
    if (!req.session || !req.session.user) {
      throw new UnauthorizedError('User not authorized') 
    }
    next()
  } catch (error) {
    next(error)
  }
}
