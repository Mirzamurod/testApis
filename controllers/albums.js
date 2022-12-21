import expressAsyncHandler from 'express-async-handler'
import Users from '../models/Users.js'
import Albums from './../models/Albums.js'

const albums = {
    // @desc    Fetch all albums
    // @route   GET /albums
    // @access  Public
    getAlbums: expressAsyncHandler(async (req, res) => {
        const albums = await Albums.find({})
        res.status(200).json(albums)
    }),

    // @desc    Get album
    // @route   GET /albums/:id
    // @access  Public
    getAlbum: expressAsyncHandler(async (req, res) => {
        const album = await Albums.findById(req.params.id)

        if (album) res.status(200).json(album)
        else res.status(400).json({ message: 'Album not found' })
    }),

    // @desc    Add album
    // @route   POST /albums
    // @access  Public
    addAlbum: expressAsyncHandler(async (req, res) => {
        const { userId, title } = req.body
        const user = await Users.findById(userId)

        if (user) {
            const addedAlbum = await Albums.create({ userId, title })
            if (addedAlbum) res.status(201).json({ message: 'Album added', success: true })
            else res.status(400).json({ message: 'Invalid album data', success: false })
        } else res.status(400).json({ message: 'User not found', success: false })
    }),

    // @desc    Edit album
    // @route   PUT /albums/:id
    // @access  Public
    editAlbum: expressAsyncHandler(async (req, res) => {
        const album = await Albums.findById(req.params.id)

        if (album) {
            const { userId, title } = req.body
            const user = await Users.findById(userId)

            if (user) {
                const updateAlbum = await Albums.findByIdAndUpdate(
                    req.params.id,
                    { userId, title, _id: req.params.id },
                    { new: true }
                )

                if (updateAlbum) res.status(200).json({ message: 'Album updated', success: true })
                else res.status(400).json({ message: 'Invalid album data', success: false })
            } else res.status(400).json({ message: 'User not found', success: false })
        } else res.status(400).json({ message: 'Albums not found', success: false })
    }),

    // @desc    Delete album
    // @route   DELETE /albums/:id
    // @access  Public
    deleteAlbum: expressAsyncHandler(async (req, res) => {
        const album = await Albums.findById(req.params.id)

        if (album) {
            await Albums.findByIdAndDelete(req.params.id)
            res.status(200).json({ message: 'Album deleted', success: true })
        } else res.status(400).json({ message: 'Album not found', success: false })
    }),
}

export default albums