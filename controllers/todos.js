import expressAsyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import { errorFormatter } from '../middleware/checkFields.js'
import Todos from '../models/Todos.js'
import Users from '../models/Users.js'

const todos = {
    /**
     * @desc    Fetch all todos
     * @route   GET /todos
     * @access  Public
     */
    getTodos: expressAsyncHandler(async (req, res) => {
        const { limit, page, sortName, sortValue, userId, title, customSelect } = req.query

        let arrs = {}

        if (typeof customSelect === 'object' && customSelect.length)
            customSelect.forEach(select => (arrs[select] = 1))
        else if (typeof customSelect === 'string') arrs[customSelect] = 1

        if (+limit && +page) {
            const todos = await Todos.find(
                {
                    userId: { $regex: userId ?? '', $options: 'i' },
                    title: { $regex: title ?? '', $options: 'i' },
                },
                arrs
            )
                .sort(sortValue ? { [sortName]: sortValue } : sortName)
                .limit(+limit)
                .skip(+limit * (+page - 1))

            const pageLists = Math.ceil(
                (
                    await Todos.find({
                        userId: { $regex: userId ?? '', $options: 'i' },
                        title: { $regex: title ?? '', $options: 'i' },
                    })
                ).length / limit
            )

            res.status(200).json({ data: todos, pageLists, page })
        } else {
            const todos = await Todos.find(
                {
                    userId: { $regex: userId ?? '', $options: 'i' },
                    title: { $regex: title ?? '', $options: 'i' },
                },
                arrs
            ).sort(sortValue ? { [sortName]: sortValue } : sortName)
            res.status(200).json(todos)
        }
    }),

    /**
     * @desc    Get todo
     * @route   GET /todos/:id
     * @access  Public
     */
    getTodo: expressAsyncHandler(async (req, res) => {
        const { customSelect } = req.query

        let arrs = {}

        if (typeof customSelect === 'object' && customSelect.length)
            customSelect.forEach(select => (arrs[select] = 1))
        else if (typeof customSelect === 'string') arrs[customSelect] = 1

        const todo = await Todos.findById(req.params.id, arrs)
        if (todo) res.status(200).json(todo)
        else res.status(400).json({ message: 'Todo not found', success: false })
    }),

    /**
     * @desc    Add todo
     * @route   POST /todos
     * @access  Public
     */
    addTodo: expressAsyncHandler(async (req, res) => {
        const errors = validationResult(req).formatWith(errorFormatter)
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array(), success: false })
        }

        const { userId, title, completed } = req.body
        const user = await Users.findById(userId)

        if (user) {
            const addedTodo = await Todos.create({ userId, title, completed })
            if (addedTodo) res.status(201).json({ message: 'Todo added', success: true })
            else res.status(400).json({ message: 'Invalid todo data', success: false })
        } else
            res.status(400).json({
                message: [{ msg: 'User not found', param: 'userId' }],
                success: false,
            })
    }),

    /**
     * @desc    Edit todo
     * @route   PUT /todos/:id
     * @access  Public
     */
    editTodo: expressAsyncHandler(async (req, res) => {
        const errors = validationResult(req).formatWith(errorFormatter)
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array(), success: false })
        }

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
            } else
                res.status(400).json({
                    message: [{ msg: 'User not found', param: 'userId' }],
                    success: false,
                })
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
