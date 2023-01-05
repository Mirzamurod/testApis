import express from 'express'
import todos from '../controllers/todos.js'
import { protect } from '../middleware/authMiddleware.js'
import checkFields from '../middleware/checkFields.js'
const router = express.Router()

router
    .route('/')
    .get(protect, todos.getTodos)
    .post(protect, checkFields(['userId', 'title', 'completed']), todos.addTodo)
router
    .route('/:id')
    .get(protect, todos.getTodo)
    .put(protect, checkFields(['userId', 'title', 'completed']), todos.editTodo)
    .delete(protect, todos.deleteTodo)

export default router
