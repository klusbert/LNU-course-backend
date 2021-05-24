import express from 'express'
import { CourseController } from '../controller/course-controller.js'

import { AuthController } from '../controller/auth-controller.js'

export const router = express.Router()

const controller = new CourseController()

const authcontroller = new AuthController()

router.get('/search/:query', controller.search)

// router.post('/postreview', (req, res, next) => authcontroller.verifyToken(req, res, next), (req, res) => controller.addReview(req, res))
router.post('/course/', (req, res) => controller.getCourse(req, res))
router.post('/postreview', (req, res, next) => authcontroller.verifyToken(req, res, next), (req, res) => controller.addReview(req, res))

router.post('/scorereview', (req, res, next) => authcontroller.verifyToken(req, res, next), (req, res) => controller.scoreReview(req, res))
router.post('/editreview', (req, res, next) => authcontroller.verifyToken(req, res, next), (req, res) => controller.editReview(req, res))
