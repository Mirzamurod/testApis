import express from 'express'
const router = express.Router()
import todos from '../controllers/todos.js'
import checkFields from '../middleware/checkFields.js'

router
    .route('/')
    .get(todos.getTodos)
    .post(checkFields(['userId', 'title', 'completed']), todos.addTodo)
router
    .route('/:id')
    .get(todos.getTodo)
    .put(checkFields(['userId', 'title', 'completed']), todos.editTodo)
    .delete(todos.deleteTodo)

export default router
