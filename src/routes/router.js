import express from 'express'
import createError from 'http-errors'
import { router as courseRouter } from './course-router.js'
export const router = express.Router()

router.use('/', courseRouter) // actions not loggedin users can do
