import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import expressAsyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import Person from '../models/Person.js'
import { errorFormatter } from '../middleware/checkFields.js'

const salt = await bcryptjs.genSalt(10)

const person = {
    /**
     * @desc    Get person profile
     * @route   GET /person
     * @access  Private
     */
    getPerson: expressAsyncHandler(async (req, res) => {
        const user = await Person.findById(req.person.id, { password: 0 })

        if (user) res.status(200).json(user)
        else res.status(400).json({ message: 'User not found' })
    }),

    /**
     * @desc    register
     * @route   POST /person/register
     * @access  Public
     */
    registerPerson: expressAsyncHandler(async (req, res) => {
        const errors = validationResult(req).formatWith(errorFormatter)
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array(), success: false })
        }

        const { username, email, password } = req.body
        const personExist = await Person.findOne({ email })

        if (!personExist) {
            const hashedPassword = await bcryptjs.hash(password, salt)
            const person = await Person.create({ username, email, password: hashedPassword })

            if (person) res.status(201).json({ message: 'User added', success: true })
            else res.status(400).json({ message: 'User invalid data', success: false })
        } else
            res.status(400).json({
                message: [{ msg: 'User already exists', param: 'email' }],
                success: false,
            })
    }),

    /**
     * @desc    login
     * @route   POST /person
     * @access  Public
     */
    loginPerson: expressAsyncHandler(async (req, res) => {
        const errors = validationResult(req).formatWith(errorFormatter)
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array(), success: false })
        }

        const { email, password } = req.body
        const person = await Person.findOne({ email })

        if (person) {
            if (await bcryptjs.compare(password, person.password))
                res.status(200).json({ data: { token: generateToken(person._id) }, success: true })
            else res.status(400).json({ message: 'Email or password is incorrect', success: false })
        } else
            res.status(400).json({
                message: [{ msg: 'User not found', param: 'email' }],
                success: false,
            })
    }),

    /**
     * @desc    Edit person
     * @route   PUT /person
     * @access  Private
     */
    editPerson: expressAsyncHandler(async (req, res) => {
        const errors = validationResult(req).formatWith(errorFormatter)
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array(), success: false })
        }

        const { email, username, password, newPassword } = req.body
        const person = await Person.findOne({ email })

        if (person) {
            if (await bcryptjs.compare(password, person.password)) {
                const hashedPassword = await bcryptjs.hash(newPassword.toString(), salt)

                await Person.findByIdAndUpdate(
                    req.person.id,
                    {
                        _id: req.person.id,
                        password: hashedPassword,
                        email,
                        username,
                    },
                    { new: true }
                )

                res.status(200).json({ message: 'User updated', success: true })
            } else res.status(400).json({ message: 'Email or password is incorrect', success: false })
        } else
            res.status(400).json({
                message: [{ msg: 'User not found', param: 'email' }],
                success: false,
            })
    }),

    /**
     * @desc    Delete person
     * @route   DELETE /person
     * @access  Private
     */
    deletePerson: expressAsyncHandler(async (req, res) => {
        const user = await Person.findById(req.person.id)

        if (user) {
            await Person.findByIdAndDelete(req.person.id)

            res.status(200).json({ message: 'User deleted', success: true })
        } else res.status(400).json({ message: 'User not found', success: false })
    }),
}

const generateToken = id => jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '14d' })

export default person
