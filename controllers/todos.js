import expressAsyncHandler from 'express-async-handler'
import Todos from '../models/Todos.js'
import Users from '../models/Users.js'

const todos = {
    /**
     * @desc    Fetch all todos
     * @route   GET /todos
     * @access  Public
     */
    getTodos: expressAsyncHandler(async (req, res) => {
        const todos = await Todos.find({})
        res.status(200).json(todos)
    }),

    /**
     * @desc    Get todo
     * @route   GET /todos/:id
     * @access  Public
     */
    getTodo: expressAsyncHandler(async (req, res) => {
        const todo = await Todos.findById(req.params.id)
        if (todo) res.status(200).json(todo)
        else res.status(400).json({ message: 'Todo not found' })
    }),

    /**
     * @desc    Add todo
     * @route   POST /todos
     * @access  Public
     */
    addTodo: expressAsyncHandler(async (req, res) => {
        const { userId, title, completed } = req.body
        const user = await Users.findById(userId)

        if (user) {
            const addedTodo = await Todos.create({ userId, title, completed })
            if (addedTodo) res.status(201).json({ message: 'Todo added', success: true })
            else res.status(400).json({ message: 'Invalid user data', success: false })
        } else res.status(400).json({ message: 'User not found', success: false })
    }),

    /**
     * @desc    Edit todo
     * @route   PUT /todos/:id
     * @access  Public
     */
    editTodo: expressAsyncHandler(async (req, res) => {
        const todo = await Todos.findById(req.params.id)

        if (todo) {
            const { userId, title, completed } = req.body
            const user = await Users.findById(userId)
            if (user) {
                const updateTodo = await Todos.findByIdAndUpdate(
                    req.params.id,
                    { userId, title, completed, _id: req.body.id },
                    { new: true }
                )

                if (updateTodo) res.status(200).json({ message: 'Todo updated', success: true })
                else res.status(400).json({ message: 'Invalid todo data', success: false })
            } else res.status(400).json({ message: 'User not found', success: false })
        } else res.status(400).json({ message: 'Todo not found', success: false })
    }),

    /**
     * @desc    Delete todo
     * @route   DELETE /todos/:id
     * @access  Public
     */
    deleteTodo: expressAsyncHandler(async (req, res) => {
        const todo = await Todos.findById(req.params.id)

        if (todo) {
            await Todos.findByIdAndDelete(req.params.id)
            res.status(200).json({ message: 'Todo deleted', success: true })
        } else res.status(400).json({ message: 'Todo not found', success: false })
    }),
}

export default todos
