import expressAsyncHandler from 'express-async-handler'
import Posts from '../models/Posts.js'
import Users from '../models/Users.js'

const posts = {
    /**
     * @desc    Fetch all Posts
     * @route   GET /posts
     * @access  Public
     */
    getPosts: expressAsyncHandler(async (req, res) => {
        const posts = await Posts.find({})
        res.status(200).json(posts)
    }),

    /**
     * @desc    Get post
     * @route   GET /Posts/:id
     * @access  Public
     */
    getPost: expressAsyncHandler(async (req, res) => {
        const post = await Posts.findById(req.params.id)

        if (post) res.status(200).json(post)
        else res.status(400).json({ message: 'Post not found' })
    }),

    /**
     * @desc    Add post
     * @route   POST /Posts
     * @access  Public
     */
    addPost: expressAsyncHandler(async (req, res) => {
        const { userId, title, body } = req.body
        const user = await Users.findById(userId)

        if (user) {
            const addedPost = await Posts.create({ userId, title, body })

            if (addedPost) res.status(201).json({ message: 'Post added', success: true })
            else res.status(400).json({ message: 'Invalid post data', success: false })
        } else res.status(400).json({ message: 'User not found', success: false })
    }),

    /**
     * @desc    Edit post
     * @route   PUT /Posts/:id
     * @access  Public
     */
    editPost: expressAsyncHandler(async (req, res) => {
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
            } else res.status(400).json({ message: 'User not found', success: false })
        } else res.status(400).json({ message: 'Post not found', success: false })
    }),

    /**
     * @desc    Delete post
     * @route   DELETE /Posts/:id
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
