import { Router } from 'express'
import controllers from './item.controllers'

const router = Router()

// /mytodolist/item
router.route('/').post(controllers.createOne)

// /mytodolist/item/:id
router
  .route('/:id')
  .put(controllers.updateOne)
  .delete(controllers.removeOne)

export default router
