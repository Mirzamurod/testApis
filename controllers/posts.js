import expressAsyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import { errorFormatter } from '../middleware/checkFields.js'
import Posts from '../models/Posts.js'
import Users from '../models/Users.js'

const posts = {
    /**
     * @desc    Fetch all Posts
     * @route   GET /posts
     * @access  Public
     */
    getPosts: expressAsyncHandler(async (req, res) => {
        const { limit, page, sortName, sortValue, userId, title, body, customSelect } = req.query

        let arrs = {}

        if (typeof customSelect === 'object' && customSelect.length)
            customSelect.forEach(select => (arrs[select] = 1))
        else if (typeof customSelect === 'string') arrs[customSelect] = 1

        if (+limit && +page) {
            const posts = await Posts.find(
                {
                    userId: { $regex: userId ?? '', $options: 'i' },
                    title: { $regex: title ?? '', $options: 'i' },
                    body: { $regex: body ?? '', $options: 'i' },
                },
                arrs
            )
                .sort(sortValue ? { [sortName]: sortValue } : sortName)
                .limit(+limit)
                .skip(+limit * (+page - 1))

            const pageLists = Math.ceil(
                (
                    await Posts.find({
                        userId: { $regex: userId ?? '', $options: 'i' },
                        title: { $regex: title ?? '', $options: 'i' },
                        body: { $regex: body ?? '', $options: 'i' },
                    })
                ).length / limit
            )

            res.status(200).json({ data: posts, pageLists, page })
        } else {
            const posts = await Posts.find(
                {
                    userId: { $regex: userId ?? '', $options: 'i' },
                    title: { $regex: title ?? '', $options: 'i' },
                    body: { $regex: body ?? '', $options: 'i' },
                },
                arrs
            ).sort(sortValue ? { [sortName]: sortValue } : sortName)
            res.status(200).json(posts)
        }
    }),

    /**
     * @desc    Get post
     * @route   GET /posts/:id
     * @access  Public
     */
    getPost: expressAsyncHandler(async (req, res) => {
        const { customSelect } = req.query

        let arrs = {}

        if (typeof customSelect === 'object' && customSelect.length)
            customSelect.forEach(select => (arrs[select] = 1))
        else if (typeof customSelect === 'string') arrs[customSelect] = 1

        const post = await Posts.findById(req.params.id, arrs)

        if (post) res.status(200).json(post)
        else res.status(400).json({ message: 'Post not found', success: false })
    }),

    /**
     * @desc    Add post
     * @route   POST /posts
     * @access  Public
     */
    addPost: expressAsyncHandler(async (req, res) => {
        const errors = validationResult(req).formatWith(errorFormatter)
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array(), success: false })
        }

        const { userId, title, body } = req.body
        const user = await Users.findById(userId)

        if (user) {
            const addedPost = await Posts.create({ userId, title, body })

            if (addedPost) res.status(201).json({ message: 'Post added', success: true })
            else res.status(400).json({ message: 'Invalid post data', success: false })
        } else
            res.status(400).json({
                message: [{ msg: 'User not found', param: 'userId' }],
                success: false,
            })
    }),

    /**
     * @desc    Edit post
     * @route   PUT /posts/:id
     * @access  Public
     */
    editPost: expressAsyncHandler(async (req, res) => {
        const errors = validationResult(req).formatWith(errorFormatter)
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array(), success: false })
        }

        const post = await Posts.findById(req.params.id)

        if (post) {
            const { userId, title, body } = req.body
            const user = Users.findById(userId)

            if (user) {
                const updatePost = await Posts.findByIdAndUpdate(
                    req.params.id,
                    { userId, title, body, _id: req.params.id },
                    { new: true }
                )

                if (updatePost) res.status(200).json({ message: 'Post updated', success: true })
                else res.status(400).json({ message: 'Invalid post data', success: false })
            } else
                res.status(400).json({
                    message: [{ msg: 'User not found', param: 'userId' }],
                    success: false,
                })
        } else res.status(400).json({ message: 'Post not found', success: false })
    }),

    /**
     * @desc    Delete post
     * @route   DELETE /posts/:id
     * @access  Public
     */
    deletePost: expressAsyncHandler(async (req, res) => {
        const post = await Posts.findById(req.params.id)

        if (post) {
            await Posts.findByIdAndDelete(req.params.id)
            res.status(200).json({ message: 'Post deleted', success: true })
        } else res.status(400).json({ message: 'Post not found', success: false })
    }),
}

export default posts
