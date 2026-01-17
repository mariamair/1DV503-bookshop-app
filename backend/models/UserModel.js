/**
 * Defines the user model.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

import { pool } from '../utils/database.js'
import bcrypt from 'bcrypt'
import { 
  ValidationError, NotFoundError, DatabaseError, UnauthorizedError } from '../utils/ErrorHandler.js'

export class UserModel {

  async createUser(userInformation) {
    try {
      await this.#validateUserInformation(userInformation)

      const query = 'INSERT INTO members (fname, lname, address, city, zip, phone, email, password)' 
        + ' VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      
      const password = await bcrypt.hash(userInformation.password, 10)
  
      const values = [
        userInformation.firstName, 
        userInformation.lastName, 
        userInformation.address, 
        userInformation.city, 
        userInformation.zip, 
        userInformation.phone ? userInformation.phone : null, 
        userInformation.email, 
        password
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

  async authenticateUser(email, password) {
    try {
      const query = 'SELECT * FROM members WHERE email = ?'
      const [user] = await pool.query(query,[email])
    
      // If user account is found, compare the supplied password with the stored password hash. Otherwise, use a dummy hash to prevent timing attacks.
      const dummyPasswordHash = await bcrypt.hash(password, 10)
      const suppliedPasswordHash = user[0] ? user[0].password : dummyPasswordHash
      const isValidPassword = await bcrypt.compare(password, suppliedPasswordHash)
        
      if (user.length === 0 || !isValidPassword) {
        throw new UnauthorizedError('Email or password incorrect.')
      }
    
      return { 
        userid: user[0].userid, 
        firstName: user[0].fname, 
      }
    } catch (error) {
      // Rethrow expected errors as-is. Wrap all other errors as database errors.
      if (error instanceof ValidationError) {
        throw error
      } else {
        throw new DatabaseError(error.message)
      }
    }
  }

  async getUserById(id) {
    try {
      if (!id) {
        throw new ValidationError('ID is required.')
      }

      const query = 'SELECT * FROM members WHERE userid = ?'
      const [user] = await pool.query(query,[id])

      if (user.length === 0) {
        throw new NotFoundError('Item not found.')
      }

      // eslint-disable-next-line no-unused-vars
      const { password: _, ...userInformationWithoutPassword } = user[0]
      return userInformationWithoutPassword

    } catch (error) {
      // Rethrow expected errors as-is. Wrap all other errors as database errors.
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error
      } else {
        throw new DatabaseError(error.message)
      }
    }
  }
  
  async #validateUserInformation(userInformation) {
    const messages = []

    if (!this.#hasRequiredInformation(userInformation)) {
      messages.push('Incomplete information.')
    }

    const invalidLengthMessages = this.#hasValidLength(userInformation)
    if (invalidLengthMessages.length > 0) {
      messages.push(...invalidLengthMessages)
    }
    
    if (!this.#hasValidZipCode(userInformation.zip)) {
      messages.push('Invalid zip code.')
    }

    if (!this.#isValidEmail(userInformation.email)) {
      messages.push('Invalid e-mail address.')
    }

    const unique = await this.#isUniqueEmail(userInformation.email)
    if (!unique) {
      messages.push('Email address has to be unique.')
    }

    if (messages.length > 0) {
      let errorMessage = ''
      for (const message of messages) {
        errorMessage += '\n' + message
      }
      throw new ValidationError(errorMessage)
    }
  }

  #hasRequiredInformation(userInformation) {
    const requiredFields = ['firstName', 'lastName', 'address', 'city', 'zip', 'email', 'password']

    const emptyFields = requiredFields.filter(
      field => !userInformation[field] 
        || userInformation[field].toString().trim() === ''
    )
    
    if (emptyFields.length > 0) {
      return false
    } else {
      return true
    }
  }

  #hasValidLength(userInformation) {
    const messages = []

    if (userInformation.firstName.length > 50 ) {
      messages.push('First name is too long.')
    }

    if (userInformation.lastName.length > 50) {
      messages.push('Last name is too long.')
    }

    if (userInformation.address.length > 50) {
      messages.push('Address is too long.')
    }

    if (userInformation.city.length > 30) {
      messages.push('City is too long.')
    }

    if (userInformation.phone.length > 15) {
      messages.push('Phone number is too long.')
    }

    if (userInformation.email.length > 40) {
      messages.push('Email is too long.')
    }

    if (userInformation.password.length < 6) {
      messages.push('Password is too short.')
    }

    if (userInformation.password.length > 200) {
      messages.push('Password is too long.')
    }

    return messages
  }

  #hasValidZipCode(zip) {
    return zip === Number.isNaN || (zip > 0 && zip <= 99999)
  }

  #isValidEmail(email) {
    const regExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regExp.test(email)
  }

  async #isUniqueEmail(email) {
    try {
      const query = 'SELECT COUNT(email) AS duplicates FROM members WHERE email = ?'

      const [result] = await pool.query(query,[email])

      return result[0].duplicates === 0 ? true : false
    } catch (error) {
      throw new DatabaseError(error.message)
    }
  }
}
