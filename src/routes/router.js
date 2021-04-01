import express from 'express'

import { router as courseRouter } from './course-router.js'

import { router as authRouter } from './auth-router.js'
export const router = express.Router()

router.use('/courses', courseRouter) // actions not logged users can do
router.use('/auth', authRouter)
