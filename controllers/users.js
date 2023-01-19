import expressAsyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import Users from '../models/Users.js'

const users = {
    /**
     * @desc    Fetch all users
     * @route   GET /users
     * @access  Public
     */
    getUsers: expressAsyncHandler(async (req, res) => {
        const {
            limit,
            page,
            sortName,
            sortValue,
            name,
            username,
            email,
            phone,
            website,
            customSelect,
        } = req.query

        let arrs = {}

        if (typeof customSelect === 'object' && customSelect.length)
            customSelect.forEach(select => (arrs[select] = 1))
        else if (typeof customSelect === 'string') arrs[customSelect] = 1

        if (+limit && +page) {
            const users = await Users.find(
                {
                    name: { $regex: name ?? '', $options: 'i' },
                    username: { $regex: username ?? '', $options: 'i' },
                    email: { $regex: email ?? '', $options: 'i' },
                    phone: { $regex: phone ?? '', $options: 'i' },
                    website: { $regex: website ?? '', $options: 'i' },
                },
                arrs
            )
                .sort(sortValue ? { [sortName]: sortValue } : sortName)
                .limit(+limit)
                .skip(+limit * (+page - 1))

            const pageLists = Math.ceil(
                (
                    await Users.find({
                        name: { $regex: name ?? '', $options: 'i' },
                        username: { $regex: username ?? '', $options: 'i' },
                        email: { $regex: email ?? '', $options: 'i' },
                        phone: { $regex: phone ?? '', $options: 'i' },
                        website: { $regex: website ?? '', $options: 'i' },
                    })
                ).length / limit
            )

            res.status(200).json({ data: users, pageLists, page })
        } else {
            const users = await Users.find(
                {
                    name: { $regex: name ?? '', $options: 'i' },
                    username: { $regex: username ?? '', $options: 'i' },
                    email: { $regex: email ?? '', $options: 'i' },
                    phone: { $regex: phone ?? '', $options: 'i' },
                    website: { $regex: website ?? '', $options: 'i' },
                },
                arrs
            ).sort(sortValue ? { [sortName]: sortValue } : sortName)
            res.status(200).json(users)
        }
    }),

    /**
     * @desc    Get user
     * @route   GET /users/:id
     * @access  Public
     */
    getUser: expressAsyncHandler(async (req, res) => {
        const { customSelect } = req.query

        let arrs = {}

        if (typeof customSelect === 'object' && customSelect.length)
            customSelect.forEach(select => (arrs[select] = 1))
        else if (typeof customSelect === 'string') arrs[customSelect] = 1

        const user = await Users.findById(req.params.id, arrs)
        if (user) res.status(200).json(user)
        else res.status(400).json({ message: 'User not found' })
    }),

    /**
     * @desc    Add user
     * @route   POST /users
     * @access  Public
     */
    addUser: expressAsyncHandler(async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array(), success: false })
        }

        const { name, username, email, address, phone, website, company } = req.body

        const addedUser = {
            name,
            username,
            email,
            phone,
            website,
            address: {
                street: address?.street,
                suite: address?.suite,
                city: address?.city,
                zipcode: address?.zipcode,
                geo: { lat: address?.geo?.lat, lng: address?.geo?.lng },
            },
            company: {
                name: company?.name,
                catchPhrase: company?.catchPhrase,
                bs: company?.bs,
            },
        }

        const user = await Users.create(addedUser)

        if (user) res.status(201).json({ message: 'User added', success: true })
        else res.status(400).json({ message: 'Invalid user data', success: false })
    }),

    /**
     * @desc    Edit user
     * @route   PUT /users/:id
     * @access  Public
     */
    editUser: expressAsyncHandler(async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array(), success: false })
        }

        const user = await Users.findById(req.params.id)

        if (user) {
            const { name, username, email, address, phone, website, company } = req.body

            const updateUser = {
                _id: req.body._id,
                name,
                username,
                email,
                phone,
                website,
                address: {
                    street: address?.street,
                    suite: address?.suite,
                    city: address?.city,
                    zipcode: address?.zipcode,
                    geo: { lat: address?.geo?.lat, lng: address?.geo?.lng },
                },
                company: {
                    name: company?.name,
                    catchPhrase: company?.catchPhrase,
                    bs: company?.bs,
                },
            }

            const updatedUser = await Users.findByIdAndUpdate(req.params.id, updateUser, {
                new: true,
            })

            if (updatedUser) res.status(200).json({ message: 'User updated', success: true })
            else res.status(400).json({ message: 'Invalid user data', success: false })
        } else res.status(400).json({ message: 'User not found', success: false })
    }),

    /**
     * @desc    Delete user
     * @route   DELETE /users/:id
     * @access  Public
     */
    deleteUser: expressAsyncHandler(async (req, res) => {
        const user = Users.findById(req.params.id)

        if (user) {
            await Users.findByIdAndDelete(req.params.id)
            res.status(200).json({ message: 'User deleted', success: true })
        } else res.status(400).json({ message: 'User not found', success: false })
    }),
}

export default users
