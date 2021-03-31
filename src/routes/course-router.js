import express from 'express'
import { CourseController } from '../controller/course-controller.js'

export const router = express.Router()

const controller = new CourseController()

router.get('/allcourses', controller.allCourses)
router.get('/coursegroup/:groupdID', controller.courseGroup)
router.get('/search/:query', controller.search)
