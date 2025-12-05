import { Router } from 'express'
import gameRoutes from './gameRoutes.js'
import stationRoutes from './stationRoutes.js'
import authRoutes from './authRoutes.js'
import userRoutes from './userRoutes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/games', gameRoutes)
router.use('/stations', stationRoutes)
router.use('/users', userRoutes)

export default router
