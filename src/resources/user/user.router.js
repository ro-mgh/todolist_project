import { Router } from 'express'
import { me } from './user.controllers'

const router = Router()

// tbc
router.get('/', me)

export default router
