/* eslint-disable max-params */
/**
 * Defines the user router.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

import express from 'express'
import { UserController } from '../../../controllers/UserController.js'

export const router = express.Router()

const userController = new UserController()

// Provide req.doc to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => userController.loadItem(req, res, next, id))

// Map HTTP verbs and route paths to controller action methods.
router.post('/register', (req, res, next) =>   userController.createUser(req, res, next))
router.post('/login', (req, res, next) => userController.login(req, res, next))
router.get('/logout', (req, res, next) => userController.logout(req, res, next))
router.get('/:id', (req, res, next) => userController.getUserById(req, res, next))
