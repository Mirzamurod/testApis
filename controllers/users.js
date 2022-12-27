import expressAsyncHandler from 'express-async-handler'
import Users from '../models/Users.js'

const users = {
    /**
     * @desc    Fetch all users
     * @route   GET /users
     * @access  Public
     */
    getUsers: expressAsyncHandler(async (req, res) => {
        const { limit, page } = req.query

        if (+limit && +page) {
            const users = await Users.find({})
                .limit(+limit)
                .skip(+limit * (+page - 1))

            const pageLists = Math.ceil((await Users.find({})).length / limit)

            res.status(200).json({ data: users, pageLists, page })
        } else res.status(400).json({ message: 'limit and page must be a number' })
    }),

    /**
     * @desc    Get user
     * @route   GET /users/:id
     * @access  Public
     */
    getUser: expressAsyncHandler(async (req, res) => {
        const user = await Users.findById(req.params.id)
        if (user) res.status(200).json(user)
        else res.status(400).json({ message: 'User not found' })
    }),

    /**
     * @desc    Add user
     * @route   POST /users
     * @access  Public
     */
    addUser: expressAsyncHandler(async (req, res) => {
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
