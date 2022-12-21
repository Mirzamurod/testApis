import expressAsyncHandler from 'express-async-handler'
import Photos from '../models/Photos.js'

const photos = {
    // @desc    Fetch all Photos
    // @route   GET /Photos
    // @access  Public
    getPhotos: expressAsyncHandler(async (req, res) => {
        const photos = await Photos.find({})
        res.status(200).json(photos)
    }),

    // @desc    Get photo
    // @route   GET /Photos/:id
    // @access  Public
    getPhoto: expressAsyncHandler(async (req, res) => {
        const photo = await Photos.findById(req.params.id)

        if (photo) res.status(200).json(photo)
        else res.status(400).json({ message: 'Photo not found' })
    }),

    // @desc    Add photo
    // @route   POST /Photos
    // @access  Public
    addPhoto: expressAsyncHandler(async (req, res) => {
        res.json('hello')
    }),
}

// @desc    Edit photo
// @route   PUT /Photos/:id
// @access  Public

// @desc    Delete photo
// @route   DELETE /Photos/:id
// @access  Public

export default photos
