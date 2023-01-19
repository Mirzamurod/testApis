import express from 'express'
import todos from '../controllers/todos.js'
import { protect } from '../middleware/authMiddleware.js'
import { todoField } from '../middleware/checkFields.js'
const router = express.Router()

router.route('/').get(protect, todos.getTodos).post(protect, todoField, todos.addTodo)
router
    .route('/:id')
    .get(protect, todos.getTodo)
    .put(protect, todoField, todos.editTodo)
    .delete(protect, todos.deleteTodo)

export default router
