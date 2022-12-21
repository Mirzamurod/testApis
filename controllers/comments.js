import expressAsyncHandler from 'express-async-handler'
import Posts from '../models/Posts.js'
import Comments from './../models/Comments.js'

const comments = {
    // @desc    Fetch all comments
    // @route   GET /comments
    // @access  Public
    getComments: expressAsyncHandler(async (req, res) => {
        const comments = await Comments.find({})
        res.status(200).json(comments)
    }),

    // @desc    Get comment
    // @route   GET /comments/:id
    // @access  Public
    getComment: expressAsyncHandler(async (req, res) => {
        const comment = await Comments.findById(req.params.id)

        if (comment) res.status(200).json(comment)
        else res.status(400).json({ message: 'Comment not found' })
    }),

    // @desc    Add comment
    // @route   POST /comments
    // @access  Public
    addComment: expressAsyncHandler(async (req, res) => {
        const { postId, name, email, body } = req.body
        const post = await Posts.findById(postId)

        if (post) {
            const addedComment = await Comments.create({ postId, name, email, body })

            if (addedComment) res.status(201).json({ message: 'Comment added', success: true })
            else res.status(400).json({ message: 'Invalid comment data', success: false })
        } else res.status(400).json({ message: 'Post not found', success: false })
    }),

    // @desc    Edit comment
    // @route   PUT /comments/:id
    // @access  Public
    editComment: expressAsyncHandler(async (req, res) => {
        const comment = await Comments.findById(req.params.id)

        if (comment) {
            const { postId, name, email, body } = req.body
            const post = await Posts.findById(postId)

            if (post) {
                const updateComment = await Comments.findByIdAndUpdate(
                    req.params.id,
                    { postId, name, email, body, _id: req.params.id },
                    { new: true }
                )

                if (updateComment)
                    res.status(200).json({ message: 'Comment updated', success: true })
                else res.status(400).json({ message: 'Invalid comment data', success: false })
            } else res.status(400).json({ message: 'Post not found', success: false })
        } else res.status(400).json({ message: 'Comment not found', success: false })
    }),

    // @desc    Delete comment
    // @route   DELETE /comments/:id
    // @access  Public
    deleteComment: expressAsyncHandler(async (req, res) => {
        const comment = await Comments.findById(req.params.id)

        if (comment) {
            await Comments.findByIdAndDelete(req.params.id)
            res.status(200).json({ message: 'Comment deleted', success: true })
        } else res.status(400).json({ message: 'Comment not found', success: false })
    }),
}

export default comments
