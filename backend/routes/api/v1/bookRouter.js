/* eslint-disable max-params */
/**
 * Defines the book router.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

import express from 'express'
import { BookController } from '../../../controllers/BookController.js'

export const router = express.Router()

const bookController = new BookController()

// Provide req.doc to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => bookController.loadItem(req, res, next, id))

// Map HTTP verbs and route paths to controller action methods.
router.get('/', (req, res, next) => bookController.getBooksBySearchParams(req, res, next))
router.get('/subjects', (req, res, next) => bookController.getSubjects(req, res, next))
router.get('/:id', (req, res, next) => bookController.getBookById(req, res, next))
