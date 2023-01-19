import express from 'express'
const router = express.Router()
import todos from '../controllers/todos.js'
import { todoField } from '../middleware/checkFields.js'

router.route('/').get(todos.getTodos).post(todoField, todos.addTodo)
router.route('/:id').get(todos.getTodo).put(todoField, todos.editTodo).delete(todos.deleteTodo)

export default router
