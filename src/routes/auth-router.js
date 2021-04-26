import express from 'express'

import { AuthController } from '../controller/auth-controller.js'

export const router = express.Router()

const controller = new AuthController()

router.post('/login', (req, res) => controller.login(req, res))
router.get('/secret', (req, res, next) => controller.verifyToken(req, res, next), (req, res) => controller.mySecretFunction(req, res))
